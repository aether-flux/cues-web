@echo off
setlocal

set CLI_NAME=cues
set BINARY_NAME=cli.exe
set INSTALL_DIR=%USERPROFILE%\AppData\Local\Programs\%CLI_NAME%
set RELEASE_URL=https://github.com/aether-flux/cues-cli/releases/latest/download/%BINARY_NAME%

echo 🚀 Installing %CLI_NAME%...

:: Create install dir if it doesn't exist
if not exist "%INSTALL_DIR%" (
  mkdir "%INSTALL_DIR%"
)

:: Download binary
echo 📦 Downloading latest release...
powershell -Command "Invoke-WebRequest -Uri '%RELEASE_URL% -OutFile '%INSTALL_DIR%\%BINARY_NAME%'"

:: Add install dir to PATH if not already added
echo 🔧 Ensuring install path is in PATH...
echo %PATH% | find /I "%INSTALL_DIR%" >nul
if errorlevel 1 (
  setx PATH "%PATH%;%INSTALL_DIR%"
  echo ✅ Added %INSTALL_DIR% to PATH. Please restart your terminal.
) else (
  echo ✅ Install path already in PATH.
)

echo 🎉 Done! You can now run "%CLI_NAME%" from any terminal.
pause

