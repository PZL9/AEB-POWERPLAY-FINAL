@echo off
title AEB POWERPLAY - TESTE LOCAL
color 0B

echo.
echo ========================================
echo    AEB POWERPLAY - TESTE LOCAL
echo ========================================
echo.
echo Testando sistema antes de usar no totem...
echo.

:: Verifica se a pasta dist existe
if not exist "dist" (
    echo ERRO: Pasta 'dist' nao encontrada!
    echo Execute 'npm run build' primeiro.
    pause
    exit /b 1
)

:: Inicia o servidor local
echo Iniciando servidor de teste...
echo URL: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

npx serve dist -p 3000 -s

pause
