@echo off
set "SOURCE_DIR=C:\Users\paulo\OneDrive\Documentos\front-end-web\senai-skill-up"
set "TARGET_DIR=C:\Users\paulo\OneDrive\Imagens\senail-skill-up"

echo Copying source files...

xcopy "%SOURCE_DIR%\src\*" "%TARGET_DIR%\src" /E /I /Y
xcopy "%SOURCE_DIR%\public\*" "%TARGET_DIR%\public" /E /I /Y

:: Copy root files
copy "%SOURCE_DIR%\.env" "%TARGET_DIR%\.env" >nul 2>&1
copy "%SOURCE_DIR%\README.md" "%TARGET_DIR%\README.md" >nul 2>&1

echo Files copied successfully!
pause
