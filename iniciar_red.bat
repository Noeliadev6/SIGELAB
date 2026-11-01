@echo off
setlocal EnableExtensions
title SIGELAB - Servidor de red local
cd /d "%~dp0"
set "ROOT=%~dp0"
set "PHP=%ROOT%runtime\php\php.exe"

if not exist "%PHP%" (
    echo [ERROR] No se encontro runtime\php\php.exe.
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

echo.
echo Este equipo es el servidor SIGELAB.
echo En las otras laptops abra: http://IP-DE-ESTE-EQUIPO:8000
echo Consulte la IP con IPCONFIG y permita el puerto 8000 en Firewall de Windows.
echo.
"%PHP%" artisan serve --host=0.0.0.0 --port=8000
endlocal
