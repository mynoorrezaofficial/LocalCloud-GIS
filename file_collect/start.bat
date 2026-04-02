@echo off
REM ============ FileHub - Dual-Server Launch ============
REM Professional file-sharing system with auto IP detection

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║         🗂️  FileHub - Startup Script               ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo ✓ Checking Python installation...
python --version
echo.

REM Check if dependencies are installed
echo ✓ Checking dependencies...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo ⓘ Installing Flask and dependencies...
    cd /d "%SCRIPT_DIR%backend"
    pip install -r requirements.txt >nul 2>&1
    if errorlevel 1 (
        echo ❌ ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    cd /d "%SCRIPT_DIR%"
)

echo ✓ Dependencies verified.
echo.

REM Create uploads directory if it doesn't exist
if not exist "%SCRIPT_DIR%uploads" (
    echo ✓ Creating uploads directory...
    mkdir "%SCRIPT_DIR%uploads"
)

REM ============ DETECT LOCAL IP ADDRESS ============
echo ✓ Detecting local IP address...

REM Use PowerShell to get the local IP address
for /f "delims=" %%A in ('powershell -NoProfile -Command "(Get-NetIPConfiguration | Where-Object {$_.IPv4DefaultGateway} | Select-Object -ExpandProperty 'IPv4Address' | Select-Object -ExpandProperty 'IPAddress' | Select-Object -First 1)" 2^>nul') do (
    set LOCAL_IP=%%A
)

REM If PowerShell fails, use ipconfig as fallback
if "!LOCAL_IP!"=="" (
    for /f "tokens=2 delims=:" %%A in ('ipconfig ^| find "IPv4"') do (
        set LOCAL_IP=%%A
        set LOCAL_IP=!LOCAL_IP: =!
        goto :found_ip
    )
)

:found_ip
if "!LOCAL_IP!"=="" (
    echo ⚠️  Could not detect IP. Using localhost...
    set LOCAL_IP=localhost
)

echo   Local IP: !LOCAL_IP!
echo.

echo ╔════════════════════════════════════════════════════════╗
echo ║         Starting FileHub Services...                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Start backend in a new window
echo [1/3] Starting Flask Backend (Port 5000)...
start "FileHub - Backend Server" cmd /k cd /d "%SCRIPT_DIR%backend" ^& python app.py

REM Wait for backend to initialize properly
echo [2/3] Waiting for API initialization (6 seconds)...
timeout /t 6 /nobreak

REM Start frontend web server in a new window
echo [3/3] Starting Frontend Server (Port 8000)...
start "FileHub - Frontend Server" cmd /k cd /d "%SCRIPT_DIR%frontend" ^& python -m http.server 8000

REM Wait for frontend server to start
timeout /t 3 /nobreak

REM Open frontend in default browser with detected IP
echo Opening FileHub in your browser...
start "" "http://!LOCAL_IP!:8000"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║      ✓ FileHub Started Successfully!                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📍 CONNECTION INFORMATION:
echo.
echo   Local Access (This PC):
echo   🌐 http://localhost:8000
echo.
echo   Network Access (Other PCs):
echo   🌐 http://!LOCAL_IP!:8000
echo.
echo   Backend API:
echo   📡 http://!LOCAL_IP!:5000/api
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║ To stop the system:                                   ║
echo ║   Close both terminal windows                         ║
echo ║   [FileHub - Backend Server]                          ║
echo ║   [FileHub - Frontend Server]                         ║
echo ╚════════════════════════════════════════════════════════╝
echo   - No other services are using these ports
echo.
pause
