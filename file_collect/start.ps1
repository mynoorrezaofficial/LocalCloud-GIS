# File Management System Startup Script (PowerShell)
# For Windows users

Write-Host @"
====================================================
  File Management System - Startup Script
====================================================
"@ -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if Python is installed
try {
    python --version | Out-Null
    Write-Host "✓ Python found" -ForegroundColor Green
    python --version
} catch {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n"

# Check if dependencies are installed
Write-Host "Checking dependencies..." -ForegroundColor Yellow
$depCheck = python -c "import flask" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Flask not found. Installing dependencies..." -ForegroundColor Yellow
    Set-Location "$ScriptDir\backend"
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Set-Location $ScriptDir
}

Write-Host "✓ Dependencies verified" -ForegroundColor Green
Write-Host "`n"

# Create uploads directory if it doesn't exist
if (-not (Test-Path "$ScriptDir\uploads")) {
    Write-Host "Creating uploads directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "$ScriptDir\uploads" -Force | Out-Null
}

Write-Host @"
====================================================
Starting File Management System...
====================================================
"@ -ForegroundColor Cyan

# Start backend in a new PowerShell window
Write-Host "[1/2] Starting Flask backend server..." -ForegroundColor Green
$backendPath = "$ScriptDir\backend"
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python app.py" -WindowStyle Normal

# Wait for backend to start
Write-Host "[2/2] Waiting for backend to initialize (3 seconds)..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Open frontend in default browser
Write-Host "Opening frontend in browser..." -ForegroundColor Green
$frontendPath = "$ScriptDir\frontend\index.html"
if (Test-Path $frontendPath) {
    Invoke-Item $frontendPath
} else {
    Write-Host "ERROR: Frontend file not found at $frontendPath" -ForegroundColor Red
}

Write-Host @"
====================================================
System started successfully!
====================================================

Backend:  http://localhost:5000/api/health
Frontend: file:///$frontendPath

Note: 
- Backend window will stay open (close to stop server)
- If browser doesn't open, manually visit the frontend path above
- For web access, run: python -m http.server 8000 in frontend folder

"@ -ForegroundColor Green

Read-Host "Press Enter to continue"
