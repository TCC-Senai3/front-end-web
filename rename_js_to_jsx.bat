@echo off
setlocal enabledelayedexpansion

for /r src\ %%f in (*.js) do (
    findstr /m "return (" "%%f" >nul
    if !errorlevel! equ 0 (
        echo Renaming %%f to %%~nf.jsx
        move /y "%%f" "%%~dpnf.jsx" >nul
    ) else (
        findstr /m "from ['"]react['"]" "%%f" >nul
        if !errorlevel! equ 0 (
            echo Renaming %%f to %%~nf.jsx
            move /y "%%f" "%%~dpnf.jsx" >nul
        ) else (
            findstr /m "<[a-zA-Z]" "%%f" >nul
            if !errorlevel! equ 0 (
                echo Renaming %%f to %%~nf.jsx
                move /y "%%f" "%%~dpnf.jsx" >nul
            )
        )
    )
)

echo Processo concluido!
