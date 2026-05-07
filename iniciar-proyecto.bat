@echo off
setlocal

cd /d "%~dp0"

if not exist ".env" (
  if exist ".env.example" (
    echo No se encontro .env. Se usara .env.example como referencia.
    powershell -NoProfile -Command "$envPath = Join-Path $PWD '.env'; $bytes = New-Object byte[] 32; $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create(); $rng.GetBytes($bytes); $rng.Dispose(); $secret = [System.BitConverter]::ToString($bytes).Replace('-', ''); Set-Content -Path $envPath -Value ('MEDICAL_SECRET=' + $secret) -Encoding ASCII"
    echo Se creo un .env local con un MEDICAL_SECRET aleatorio.
    echo Si quieres usar otro, edita .env antes de volver a iniciar.
  ) else (
    echo No se encontro .env ni .env.example.
    echo Crea un archivo .env con la variable MEDICAL_SECRET.
  )
)

if exist ".env" (
  findstr /b /c:"MEDICAL_SECRET=" ".env" >nul 2>&1
  if errorlevel 1 (
    powershell -NoProfile -Command "$envPath = Join-Path $PWD '.env'; $lines = @(); if (Test-Path $envPath) { $lines = Get-Content $envPath }; $bytes = New-Object byte[] 32; $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create(); $rng.GetBytes($bytes); $rng.Dispose(); $secret = [System.BitConverter]::ToString($bytes).Replace('-', ''); $filtered = @($lines | Where-Object { $_ -notmatch '^MEDICAL_SECRET=' }); $filtered + ('MEDICAL_SECRET=' + $secret) | Set-Content -Path $envPath -Encoding ASCII"
    echo Se agrego un MEDICAL_SECRET aleatorio a .env.
  )
)

echo Iniciando proyecto...
start "Firestock" cmd /k "npm start"
if errorlevel 1 (
  echo.
  echo No se pudo abrir la ventana del servidor.
  pause
)

exit /b
