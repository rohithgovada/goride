@echo off
title GoRide Platform Launcher (Production Mode)
echo ========================================================
echo       Starting GoRide Multi-Modal Mobility Platform
echo        (Bike • Auto Rickshaw • City Bus • Metro)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting GoRide Backend REST API on Port 5000...
cd /d "%~dp0backend"
start "GoRide - Backend API" cmd /k "npm start"

timeout /t 2 /nobreak >nul

echo [2/3] Building and Serving Production Frontend on Port 5173...
cd /d "%~dp0frontend"
start "GoRide - Production Frontend" cmd /k "npm run preview"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Cloudflare Global Tunnel for Mobile & Remote Access...
cd /d "%~dp0..\.."
start "GoRide - Cloudflare Global Tunnel" cmd /k "cloudflared.exe tunnel --protocol http2 --edge-ip-version 4 --url http://127.0.0.1:5173"

timeout /t 3 /nobreak >nul
echo.
echo ========================================================
echo   GoRide is now RUNNING INDEPENDENTLY on Windows!
echo.
echo   Local Laptop URL:  http://localhost:5173
echo   Global Mobile URL: (Check the Cloudflare tunnel window)
echo.
echo   You can completely CLOSE Antigravity!
echo   GoRide will stay open as long as these windows stay open.
echo ========================================================
echo.
start http://localhost:5173
pause
