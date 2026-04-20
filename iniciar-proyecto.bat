@echo off
setlocal

cd /d "%~dp0"

echo Iniciando proyecto...
call npm start

if errorlevel 1 (
  echo.
  echo Ocurrio un error al iniciar el proyecto.
  pause
)
