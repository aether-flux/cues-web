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
powershell -Command "Invoke-WebRequest -Uri \"%RELEASE_URL%\" -OutFile \"%INSTALL_DIR%\%BINARY_NAME%\""

:: Add install dir to PATH if not already added
echo 🔧 Ensuring install path is in PATH...

echo %PATH% | find /I "%INSTALL_DIR%" >nul
if errorlevel 1 (
  echo 🧪 Current PATH doesn't contain %INSTALL_DIR%. Attempting to add...

  :: Try to get registry PATH
  for /f "tokens=3*" %%A in ('reg query "HKCU\Environment" /v PATH 2^>nul') do (
    set "CURRENT_PATH=%%A %%B"
  )

  call set CURRENT_PATH=%CURRENT_PATH%
  echo 🧪 Registry PATH: %CURRENT_PATH%

  echo %CURRENT_PATH% | find /I "%INSTALL_DIR%" >nul
  if errorlevel 1 (
    set "NEW_PATH=%CURRENT_PATH%;%INSTALL_DIR%"
    reg add "HKCU\Environment" /v PATH /t REG_EXPAND_SZ /d "%NEW_PATH%" /f >nul
    echo ✅ Added %INSTALL_DIR% to PATH via registry.
    echo 🔁 Please log out and log back in (or reboot) to apply it.
  ) else (
    echo ✅ Install path already in PATH (registry).
  )
) else (
  echo ✅ Install path already in PATH (session).
)

echo 🎉 Done! You can now run "%CLI_NAME%" from any terminal (after logout/login if needed).
pause
