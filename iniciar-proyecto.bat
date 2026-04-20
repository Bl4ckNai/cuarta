@echo off
setlocal

cd /d "%~dp0"

if not exist ".env" (
  if exist ".env.example" (
    echo No se encontro .env. Se usara .env.example como referencia.
    echo Copia .env.example a .env y define MEDICAL_SECRET con un valor robusto.
  ) else (
    echo No se encontro .env ni .env.example.
    echo Crea un archivo .env con la variable MEDICAL_SECRET.
  )
)

echo Iniciando proyecto...
call npm start

if errorlevel 1 (
  echo.
  echo Ocurrio un error al iniciar el proyecto.
  echo Verifica que MEDICAL_SECRET exista en .env o en variables de entorno del sistema.
  pause
)
