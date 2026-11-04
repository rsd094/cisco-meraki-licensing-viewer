# Cisco Meraki Licensing Viewer 2.0

A small app that runs on your own computer and shows, for every Meraki organization your API key can see:

- **Inventory**: every device claimed in the organization, assigned or not.
- **Deployed**: devices in a network. Only these need a license.
- **Licensed / Unlicensed**: how many deployed devices the org's active licenses actually cover. Unlicensed devices link to a page listing the networks they're in, with a shortcut to those devices.
- **Each device's license class and SKU**: Enterprise or Advantage, plus the subscription license SKU its hardware model needs, per Meraki's licensing docs.
- **Each org's share of licensed hardware** across all your orgs, with filters by product family (MX, MS, MR, CW, MV, MT…) and CSV export.

It's a read-only companion to Meraki Dashboard, not a replacement for it.

> **Disclaimer:** This tool only sends GET (read) requests to the Meraki Dashboard API. It never sends POST, PUT or DELETE requests, so it can't make any changes to your Meraki Dashboard.

## Requirements

- **Python 3.8 or newer.** Macs with the Xcode command-line tools already have it. Otherwise get it from <https://www.python.org/downloads/>. On Windows, tick **"Add python.exe to PATH"** during install.
- **A Meraki Dashboard API key.** A read-only admin is enough. See [how to create an API key](https://developer.cisco.com/meraki/api-v1/authorization/).

## Start it

1. Unzip the folder anywhere.
2. Double-click the launcher for your system:
   - **Mac:** `Start Licensing Viewer (Mac).command`. The first time, macOS may block it because it was downloaded. Right-click it, choose **Open**, then **Open** again.
   - **Windows:** `Start Licensing Viewer (Windows).bat`.
3. Your browser opens the Licensing Viewer. Enter your API key and click **Connect**.

Keep the small terminal window open while you use the viewer. Closing it stops the app.

From a terminal you can also run `python3 server.py --open`, adding `--port 9000` if you want a specific port.

## About your API key

- It's stored only in your browser on your computer. Untick "Remember on this computer" to keep it only until the browser tab closes.
- It's sent only to this app running locally, which passes it to `api.meraki.com` and nowhere else.
- To switch keys or remove it, click **API key** at the top right.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Meraki rejected that API key" | Check the key in Meraki Dashboard (My Profile → API access) and that API access is enabled for the org. |
| `CERTIFICATE_VERIFY_FAILED` on Mac | Open your Python folder in Applications and run **Install Certificates.command**. |
| An org shows "API access disabled" | An org admin needs to enable API access under Organization → Settings. |
| The page looks out of date | Hard refresh with ⌘⇧R or Ctrl+Shift+R. |

## Files

- `index.html`: the viewer.
- `licensing-map.js`: maps each hardware model to its license class and SKU, from Meraki's Subscription licensing docs for MX, Z, MS, MR, Wi-Fi 7 (CW), MV and MT. Edit it when new models ship. Models not in those docs are tagged **inferred**.
- `server.py`: the local read-only server, using only the Python standard library.

## Meraki API endpoints used (all GET)

| Purpose | Endpoint |
|---|---|
| Orgs and licensing model | `/organizations` |
| Inventory and network assignment | `/organizations/{id}/inventory/devices` |
| Network names / online status | `/organizations/{id}/networks`, `/organizations/{id}/devices/statuses` |
| Co-term licensing and edition | `/organizations/{id}/licenses/overview`, `/organizations/{id}/licensing/coterm/licenses` |
| Per-device licensing | `/organizations/{id}/licenses` |
| Subscription tier | `/administered/licensing/subscription/subscriptions`, `/administered/licensing/subscription/entitlements` |
