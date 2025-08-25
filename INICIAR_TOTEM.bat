@echo off
title AEB POWERPLAY - TOTEM
color 0A

echo.
echo ========================================
echo    AEB POWERPLAY - SISTEMA TOTEM
echo ========================================
echo.
echo Iniciando sistema...
echo.

:: Verifica se o Chrome está instalado
where chrome >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Google Chrome nao encontrado!
    echo Instale o Chrome para continuar.
    pause
    exit /b 1
)

:: Navega para a pasta do pen drive
cd /d "%~dp0"

:: Inicia o servidor local
echo Iniciando servidor local...
start /min cmd /c "npx serve dist -p 3000 -s"

:: Aguarda o servidor iniciar
timeout /t 3 /nobreak >nul

:: Abre o Chrome em modo totem
echo Abrindo aplicacao no Chrome...
start chrome --kiosk --disable-web-security --user-data-dir="%TEMP%\aeb-totem" --no-first-run --no-default-browser-check "http://localhost:3000"

echo.
echo Sistema iniciado com sucesso!
echo Pressione qualquer tecla para fechar esta janela...
pause >nul

:: Fecha o Chrome e o servidor
taskkill /f /im chrome.exe >nul 2>nul
taskkill /f /im node.exe >nul 2>nul
