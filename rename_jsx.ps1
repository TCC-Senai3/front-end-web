# Script para renomear arquivos .js que contêm JSX para .jsx

# Diretório raiz para busca
$rootDir = "$PSScriptRoot\src"

# Encontrar todos os arquivos .js
$jsFiles = Get-ChildItem -Path $rootDir -Filter *.js -Recurse -File

foreach ($file in $jsFiles) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    
    # Verifica se o arquivo contém JSX
    if ($content -match 'return \(' -or 
        $content -match 'React\.' -or 
        $content -match 'from [\"\']react[\"\']' -or
        $content -match '<[a-zA-Z]' -or 
        $content -match '<\\/') {
        
        $newPath = $file.FullName -replace '\.js$', '.jsx'
        
        # Verificar se o arquivo .jsx já existe
        if (-not (Test-Path $newPath)) {
            Write-Host "Renomeando $($file.FullName) para $newPath"
            Rename-Item -Path $file.FullName -NewName $newPath -Force
        }
    }
}

Write-Host "Processo concluído!" -ForegroundColor Green
