@echo off
setlocal enabledelayedexpansion

REM Lista de diretórios para processar
set "src_dir=src"

REM Lista de palavras-chave que indicam que o arquivo contém JSX
set "jsx_keywords=React import\ React from\ \"react\" from\ \'react\' createElement ^<div ^</div ^<span ^</span return\ ( ^<^> ^<^/^>"

echo Procurando arquivos JSX...

REM Encontra e renomeia arquivos .js que contêm JSX
for /r %src_dir% %%f in (*.js) do (
    set "is_jsx=0"
    
    REM Verifica se o arquivo contém JSX
    for %%k in (%jsx_keywords%) do (
        findstr /m /c:"%%~k" "%%f" >nul
        if !errorlevel! equ 0 (
            set "is_jsx=1"
            goto :check_done
        )
    )
    
    :check_done
    if !is_jsx! equ 1 (
        set "old_path=%%f"
        set "new_path=%%~dpnf.jsx"
        
        if not exist "!new_path!" (
            echo Renomeando: %%f
            ren "%%f" "%%~nxf.jsx"
            
            REM Atualiza referências
            echo Atualizando referências para: %%~nf.jsx
            powershell -Command "(Get-ChildItem -Path .\ -Include *.js,*.jsx,*.ts,*.tsx -Recurse -Exclude node_modules | Select-String -Pattern '%%~nf\.js' -List | Select-Object -ExpandProperty Path) | ForEach-Object { (Get-Content $_ -Raw) -replace '([\'\"])%%~nf\.js([\'\"])', '$1%%~nf.jsx$2' | Set-Content $_ -NoNewline }"
        )
    )
)

echo Processo concluído!
pause
