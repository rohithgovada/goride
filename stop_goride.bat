@echo off
title Stop GoRide
echo Stopping GoRide services...
taskkill /f /im cloudflared.exe 2>nul
taskkill /f /im node.exe 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /f /pid %%a 2>nul
echo GoRide services stopped successfully.
pause
