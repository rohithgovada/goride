@echo off
title GoRide - Deploy to GitHub Pages
echo ========================================================
echo       Deploying GoRide directly to GitHub Pages
echo ========================================================
echo.

cd /d "%~dp0frontend"
echo [1/3] Building production bundle for GitHub Pages...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Exiting...
    pause
    exit /b %ERRORLEVEL%
)

echo [2/3] Preparing static assets...
cd dist
echo. > .nojekyll
copy index.html 404.html >nul

echo [3/3] Pushing to gh-pages branch...
git init >nul 2>&1
git checkout -B gh-pages >nul 2>&1
git add -A
git commit -m "deploy: update live GoRide GitHub Pages site" >nul 2>&1
git remote add origin git@github.com:rohithgovada/goride.git >nul 2>&1
git push -f origin gh-pages

rd /s /q .git >nul 2>&1

echo.
echo ========================================================
echo   Deployment to GitHub Pages SUCCESSFUL!
echo   Your live permanent link:
echo   https://rohithgovada.github.io/goride/
echo ========================================================
echo.
pause
