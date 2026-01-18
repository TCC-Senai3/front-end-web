# Script para renomear arquivos .js que contêm JSX para .jsx

# Função para verificar se um arquivo contém JSX
function Test-FileContainsJSX {
    param (
        [string]$filePath
    )
    
    $jsxPatterns = @(
        'return \\(',
        'React\\.',
        'from [\"\']react[\"\']',
        '<[a-zA-Z]',
        '<\\/',
        '\\{\\s*\$',
        '\\{\\s*[a-zA-Z0-9_]+\\s*\\.'
    )
    
    $content = Get-Content -Path $filePath -Raw -ErrorAction SilentlyContinue
    if (-not $content) { return $false }
    
    foreach ($pattern in $jsxPatterns) {
        if ($content -match $pattern) {
            return $true
        }
    }
    
    return $false
}

# Diretório raiz para busca
$rootDir = "$PSScriptRoot\src"

# Encontrar todos os arquivos .js
$jsFiles = Get-ChildItem -Path $rootDir -Filter *.js -Recurse -File

foreach ($file in $jsFiles) {
    if (Test-FileContainsJSX -filePath $file.FullName) {
        $newPath = $file.FullName -replace '\.js$', '.jsx'
        
        # Verificar se o arquivo .jsx já existe
        if (-not (Test-Path $newPath)) {
            Write-Host "Renomeando $($file.FullName) para $newPath"
            Rename-Item -Path $file.FullName -NewName $newPath -Force
            
            # Atualizar referências
            $searchPattern = [regex]::Escape($file.FullName -replace '\.js$', '.js')
            $replacePattern = $newPath -replace '\\', '\\'
            
            Get-ChildItem -Path $rootDir -Include *.js,*.jsx,*.ts,*.tsx -Recurse -File | ForEach-Object {
                $content = Get-Content $_.FullName -Raw
                $updatedContent = $content -replace $searchPattern, $replacePattern
                
                if ($content -ne $updatedContent) {
                    Write-Host "Atualizando referências em $($_.FullName)"
                    $updatedContent | Set-Content -Path $_.FullName -NoNewline
                }
            }
        }
    }
}

Write-Host "Processo concluído!" -ForegroundColor Green
