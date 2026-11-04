# Cisco Meraki Licensing Viewer 2.0

A small app that runs on your own computer and shows, for every Meraki organization your API key can see:

- **Inventory**: every device claimed in the organization, assigned or not.
- **Deployed**: devices in a network. Only these need a license.
- **Config source: device (monitoring)**: Catalyst devices with config source: device and Catalyst 9800 wireless controllers are managed on-prem and only send telemetry to Dashboard, so they don't consume a license and show **N/A**. The viewer reads this from each device's "Cloud configuration" detail in the inventory API, and the **Config source** filter splits devices into cloud and device. Exception: Wi-Fi 7 APs consume a license even with config source: device. A Catalyst device moved to config source: cloud needs a license.
- **Licensed / Unlicensed**: how many deployed devices the org's active licenses actually cover. Unlicensed devices link to a page listing the networks they're in, with a shortcut to those devices.
- **Each device's license class and SKU**: Enterprise or Advantage, plus the subscription license SKU its hardware model needs, per Meraki's licensing docs.
- **Each org's share of licensed hardware** across all your orgs, with filters by product family (MX, MS, MR, CW, MV, MT…) and CSV export.

It's a read-only companion to Meraki Dashboard, not a replacement for it.

> **Disclaimer:** This tool only sends GET (read) requests to the Meraki Dashboard API. It never sends POST, PUT or DELETE requests, so it can't make any changes to your Meraki Dashboard.

## Requirements

- **Python 3.8 or newer.** If it's missing, the launcher offers to install it for you: on Windows through Windows Package Manager (just for your account, no admin rights needed), and on a Mac through Apple's Command Line Tools installer. You can also get it from <https://www.python.org/downloads/>. On Windows, tick **"Add python.exe to PATH"** during install.
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
| Windows: nothing happens, or the window flashes and closes | Make sure you extracted the zip (right-click → **Extract All…**) and are running the launcher from the extracted folder, not from inside the zip. |
| Windows: Python was just installed but the viewer doesn't start | Close the launcher window and double-click it again. |
| Windows: the Python install failed | Install Python from <https://www.python.org/downloads/>, ticking **"Add python.exe to PATH"**. The Microsoft Store "python" shortcut alone isn't enough. |
| Windows: "Windows protected your PC" | Click **More info** → **Run anyway**. |
| `CERTIFICATE_VERIFY_FAILED` on Mac | Open your Python folder in Applications and run **Install Certificates.command**. |
| An org shows "API access disabled" | An org admin needs to enable API access under Organization → Settings. |
| The page looks out of date | Hard refresh with ⌘⇧R or Ctrl+Shift+R. |

## Files

- `index.html`: the viewer.
- `licensing-map.js`: maps each hardware model to its license for both licensing models:
  - **Subscription orgs:** the size-class SKU (e.g. LIC-MX-S, LIC-MS-100-S) and the Essentials / Advantage tier, from Meraki's Subscription licensing docs.
  - **Co-term and per-device orgs:** the per-model SKU (e.g. LIC-MX67-SDW, LIC-MS130-CMPTA, LIC-MR-ADV) and the org's edition: MX and Cisco Secure Routers Enterprise / Advanced Security / Secure SD-WAN Plus; MR Enterprise / Advanced; MS130, MS150, MS390 and Catalyst 9200L-M / 9300-M Enterprise / Advanced. From Meraki's Co-Termination licensing docs and the Cisco Cloud-Managed Switching data sheet. Co-term SKUs are shown without their term (add e.g. -1YR).
  - **Unified licensing (any org):** Wi-Fi 7 APs (LIC-CW), C9350 / C9550 / C9610 smart switches (LIC-CS-AC1 / LIC-CS-CO) and Cisco 8000 Secure Routers (LIC-CSWAN) with Essentials / Advantage tiers. In a co-term org, Wi-Fi 7 counts against the MR licenses and follows the MR edition.

  Edit it when new models ship. Mappings not confirmed in the docs are tagged **inferred**.
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
