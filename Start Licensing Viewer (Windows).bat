@echo off
rem Double-click to start the Cisco Meraki Licensing Viewer. Close this window to stop it.
cd /d "%~dp0"
where py >nul 2>nul && (py -3 server.py --open & goto :end)
where python >nul 2>nul && (python server.py --open & goto :end)
echo Python 3 is required. Install it from https://www.python.org/downloads/ (tick "Add python.exe to PATH") and try again.
pause
:end
