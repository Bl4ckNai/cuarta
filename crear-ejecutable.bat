@echo off
setlocal

cd /d "%~dp0"

echo Instalando dependencias (incluyendo pkg)...
call npm install
if errorlevel 1 (
  echo.
  echo Error: no se pudieron instalar dependencias.
  pause
  exit /b 1
)

echo.
echo Compilando ejecutable...
call npm run build:exe
if errorlevel 1 (
  echo.
  echo Primer intento fallido. Reintentando con cache limpia de pkg...
  if exist ".pkg-cache" rmdir /s /q ".pkg-cache"
  set "PKG_CACHE_PATH=%cd%\.pkg-cache"
  set "PKG_IGNORE_HASH=1"
  call npm run build:exe
  if errorlevel 1 (
    echo.
    echo Error: fallo la compilacion del ejecutable incluso tras reintento.
    echo Revisa conexion, proxy o antivirus y vuelve a intentar.
    pause
    exit /b 1
  )
)

echo.
echo Listo. Ejecutable generado en: dist\inv_cuarta.exe
echo Copia la carpeta dist al otro PC y ejecuta el .exe desde ahi.
pause
exit /b 0
