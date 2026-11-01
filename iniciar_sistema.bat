@echo off
setlocal EnableExtensions
title SIGELAB - Sistema offline
color 0A
cd /d "%~dp0"
set "ROOT=%~dp0"
set "PHP=%ROOT%runtime\php\php.exe"
set "URL=http://127.0.0.1:8000"

if not exist "%PHP%" (
    echo [ERROR] No se encontro runtime\php\php.exe.
    echo Copie PHP 8.3 portable dentro de runtime\php antes de ejecutar SIGELAB.
    pause
    exit /b 1
)
if not exist "%ROOT%.env" (
    copy /y "%ROOT%.env.offline" "%ROOT%.env" >nul
    "%PHP%" artisan key:generate --no-interaction
)
set "FRESH_DATABASE=0"
if not exist "%ROOT%database\database.sqlite" (
    type nul > "%ROOT%database\database.sqlite"
    set "FRESH_DATABASE=1"
)

echo [INFO] Aplicando migraciones pendientes...
"%PHP%" artisan config:clear --no-interaction
"%PHP%" artisan migrate --force --no-interaction
if errorlevel 1 (
    echo [ERROR] No se pudieron aplicar las migraciones.
    pause
    exit /b 1
)
set "USER_COUNT="
for /f "delims=" %%i in ('"%PHP%" artisan tinker --execute="echo App\Models\User::count();" 2^>nul') do set "USER_COUNT=%%i"
echo [INFO] Usuarios existentes: %USER_COUNT%
if "%USER_COUNT%" == "0" (
    echo [INFO] Cargando datos iniciales y usuarios...
    "%PHP%" artisan db:seed --force --no-interaction
    if errorlevel 1 (
        echo [ERROR] No se pudo ejecutar el seeder inicial.
        pause
        exit /b 1
    )
)

echo [OK] SIGELAB disponible en %URL%
start "" "%URL%"
echo [INFO] No cierre esta ventana mientras use el sistema.
"%PHP%" artisan serve --host=127.0.0.1 --port=8000
endlocal
