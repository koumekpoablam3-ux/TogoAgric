@echo off
title TogoAgric v7 - Demarrage
echo.
echo  ========================================
echo    TogoAgric v7 - La plateforme agricole du Togo
echo  ========================================
echo.

echo [1/4] Arret des processus existants...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul 2>&1
echo      Processus arretes: OK
echo.

echo [2/4] Verification de Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installe sur votre ordinateur.
    echo Telechargez Node.js sur: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo      Node.js est installe: OK
echo.

echo [3/4] Installation des dependances...
if not exist node_modules (
    call npm install
    if errorlevel 1 (
        echo ERREUR: L'installation a echoue.
        echo.
        pause
        exit /b 1
    )
) else (
    echo      Dependances deja installees: OK
)
echo.

echo [4/4] Demarrage du serveur...
echo      Le site sera accessible sur: http://localhost:3000
echo      Appuyez sur Ctrl+C pour arreter le serveur.
echo.
echo  ========================================
echo    OUVRIR: http://localhost:3000
echo  ========================================
echo.
call npm run dev
