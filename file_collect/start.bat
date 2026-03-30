@echo off
REM File Management System Startup Script for Windows

echo.
echo ====================================================
echo   File Management System - Startup Script
echo ====================================================
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo Checking Python installation...
python --version
echo.

REM Check if dependencies are installed
echo Checking dependencies...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo WARNING: Flask not found. Installing dependencies...
    cd /d "%SCRIPT_DIR%backend"
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    cd /d "%SCRIPT_DIR%"
)

echo Dependencies verified.
echo.

REM Create uploads directory if it doesn't exist
if not exist "%SCRIPT_DIR%uploads" (
    echo Creating uploads directory...
    mkdir "%SCRIPT_DIR%uploads"
)

echo.
echo ====================================================
echo Starting File Management System...
echo ====================================================
echo.

echo.
echo Starting all services...
echo.

REM Start backend in a new window
echo [1/3] Starting Flask Backend Server (port 5000)...
start "FileHub - Backend Server" cmd /k cd /d "%SCRIPT_DIR%backend" ^& python app.py

REM Wait for backend to initialize properly
echo [2/3] Waiting for Flask API to fully initialize (6 seconds)...
timeout /t 6 /nobreak

REM Start frontend web server in a new window
echo [3/3] Starting Frontend Web Server (port 8000)...
start "FileHub - Frontend Server" cmd /k cd /d "%SCRIPT_DIR%frontend" ^& python -m http.server 8000

REM Wait for frontend server to start
timeout /t 3 /nobreak

REM Open frontend in default browser
echo Opening FileHub in your browser...
start "" "http://localhost:8000"

echo.
echo ====================================================
echo     ✓ File Management System Started!
echo ====================================================
echo.
echo SERVERS RUNNING:
echo   - Backend API:       http://localhost:5000/api
echo   - Frontend UI:       http://localhost:8000
echo.
echo LOCAL ACCESS:
echo   Open your browser:   http://localhost:8000
echo.
echo NETWORK ACCESS (from other PCs):
echo   Use this URL:        http://192.168.140.26:8000
echo.
echo STOPPING THE SYSTEM:
echo   Close the Backend window (titled: FileHub - Backend Server)
echo   Close the Frontend window (titled: FileHub - Frontend Server)
echo.
echo NOTE:
echo   If servers don't appear, check that:
echo   - Port 5000 and 8000 are available
echo   - No other services are using these ports
echo.
pause
