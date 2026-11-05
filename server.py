#!/usr/bin/env python3
"""Local server for the Cisco Meraki License Lens.

Serves the viewer and forwards GET /api/<path> to https://api.meraki.com/api/v1/<path>.
It follows pagination (Link: rel=next) so list endpoints come back complete, and retries
on 429 using Retry-After. Only GET requests are forwarded; nothing can be changed.

API key: each user enters their own key in the viewer. It is kept in their browser and
sent to this local server only, which passes it on to api.meraki.com and nowhere else.
Optionally a default key can come from MERAKI_DASHBOARD_API_KEY, or (macOS) the Keychain
item named by MERAKI_KEYCHAIN_SERVICE (default "meraki-dashboard-api").

Usage:  python3 server.py [--port 8765] [--open]
"""
import argparse
import json
import os
import re
import ssl
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE = os.environ.get("MERAKI_BASE_URL", "https://api.meraki.com/api/v1")
HERE = os.path.dirname(os.path.abspath(__file__))
MAX_RPS = 8  # stay under Meraki's 10 req/s per-org limit
KEY_HEADER = "X-Meraki-API-Key"


def ssl_context():
    # python.org builds on macOS ship without system CA certs; use certifi when it's there.
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


SSL_CTX = ssl_context()


def default_api_key():
    key = os.environ.get("MERAKI_DASHBOARD_API_KEY")
    if key:
        return key.strip()
    if sys.platform == "darwin":
        service = os.environ.get("MERAKI_KEYCHAIN_SERVICE", "meraki-dashboard-api")
        try:
            out = subprocess.run(["security", "find-generic-password", "-s", service, "-w"],
                                 capture_output=True, text=True, check=True)
            return out.stdout.strip() or None
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
    return None


DEFAULT_KEY = None
_lock = threading.Lock()
_last = [0.0]


def throttle():
    with _lock:
        wait = _last[0] + 1.0 / MAX_RPS - time.monotonic()
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.monotonic()


def meraki_get(url, key):
    """One GET with 429 retry. Returns (status, body_bytes, headers)."""
    for attempt in range(6):
        throttle()
        # Every call to Meraki is a GET: this app never sends POST, PUT, PATCH or DELETE.
        req = urllib.request.Request(url, method="GET", headers={
            "Authorization": f"Bearer {key}",
            "Accept": "application/json",
            "User-Agent": "MerakiLicenseLens/2.0",
        })
        try:
            with urllib.request.urlopen(req, timeout=60, context=SSL_CTX) as r:
                return r.status, r.read(), r.headers
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 5:
                time.sleep(float(e.headers.get("Retry-After", 2)))
                continue
            return e.code, e.read(), e.headers
        except urllib.error.URLError as e:
            msg = str(e.reason)
            if "CERTIFICATE_VERIFY_FAILED" in msg:
                msg += " (on macOS, run 'Install Certificates.command' from your Python folder)"
            return 502, json.dumps({"errors": [f"Could not reach Meraki: {msg}"]}).encode(), {}


def next_link(headers):
    link = headers.get("Link") or ""
    m = re.search(r'<([^>]+)>;\s*rel=next', link)
    return m.group(1) if m else None


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=HERE, **kw)

    def end_headers(self):
        # Don't let browsers cache the page or mapping file, so updates show up on reload.
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.log_date_time_string(), fmt % args))

    def send_json(self, status, obj):
        body = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        # Only answer requests addressed to this machine (blocks DNS-rebinding pages).
        host = (self.headers.get("Host") or "").split(":")[0]
        if host not in ("localhost", "127.0.0.1", "[::1]"):
            return self.send_error(403, "Forbidden host")
        if self.path == "/config":
            return self.send_json(200, {"hasDefaultKey": bool(DEFAULT_KEY)})
        if not self.path.startswith("/api/"):
            return super().do_GET()

        key = (self.headers.get(KEY_HEADER) or "").strip() or DEFAULT_KEY
        if not key:
            return self.send_json(401, {"errors": ["No API key. Enter your Meraki API key in License Lens."]})

        url = BASE + self.path[len("/api"):]
        status, body, headers = meraki_get(url, key)
        # Follow pagination for list responses so the page gets everything.
        if status == 200:
            data = json.loads(body or b"null")
            nxt = next_link(headers)
            pages = 1
            while isinstance(data, list) and nxt and pages < 200:
                s2, b2, h2 = meraki_get(nxt, key)
                if s2 != 200:
                    status, body = s2, b2
                    break
                data.extend(json.loads(b2))
                nxt = next_link(h2)
                pages += 1
            else:
                body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        self.send_error(405, "Read-only")
    do_PUT = do_DELETE = do_PATCH = do_POST


def main():
    global DEFAULT_KEY
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8765)))
    p.add_argument("--open", action="store_true", help="open the viewer in your browser")
    args = p.parse_args()
    DEFAULT_KEY = default_api_key()

    srv = None
    for port in range(args.port, args.port + 20):  # step past ports already in use
        try:
            srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)
            break
        except OSError:
            continue
    if not srv:
        sys.exit(f"No free port between {args.port} and {args.port + 19}.")
    url = f"http://localhost:{srv.server_port}"
    print(f"Cisco Meraki License Lens running at {url}  (Ctrl+C to stop)", flush=True)
    print("Read-only: only GET requests are sent to the Meraki Dashboard API; nothing is changed.", flush=True)
    if args.open:
        threading.Timer(0.5, webbrowser.open, [url]).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
