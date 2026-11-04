@echo off
setlocal
title Cisco Meraki Licensing Viewer 2.0
rem Double-click to start the Cisco Meraki Licensing Viewer. Close this window to stop it.
cd /d "%~dp0"

if not exist "server.py" (
  echo server.py wasn't found next to this launcher.
  echo.
  echo If you opened this from inside the .zip file: close it, right-click the .zip,
  echo choose "Extract All...", then run this launcher from the extracted folder.
  goto :done
)

rem Check Python really runs: the Microsoft Store "python" shortcut exists even when Python isn't installed.
set "PY="
py -3 --version >nul 2>nul && set "PY=py -3"
if not defined PY (python --version >nul 2>nul && set "PY=python")
if not defined PY (python3 --version >nul 2>nul && set "PY=python3")
if not defined PY (
  echo Python 3 is required but wasn't found.
  echo.
  echo Install it from https://www.python.org/downloads/
  echo During install, tick "Add python.exe to PATH". Then run this launcher again.
  goto :done
)

echo Starting the Cisco Meraki Licensing Viewer...
echo Your browser should open in a moment. If it doesn't, open the http://localhost address shown below.
echo Keep this window open while you use the viewer. Close it to stop.
echo.
%PY% server.py --open
echo.
echo The viewer has stopped. Any error is shown above.

:done
echo.
pause
