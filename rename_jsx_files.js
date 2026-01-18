const fs = require('fs');
const path = require('path');

const JSX_KEYWORDS = [
  'React',
  'import React',
  'from "react"',
  'from \'react\'',
  'createElement',
  '<div',
  '</div>',
  '<span',
  '</span>',
  'return (',
  'return\n(',
  'React.Fragment',
  '<>',
  '</>'
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js') && !file.endsWith('.test.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasJsx = JSX_KEYWORDS.some(keyword => content.includes(keyword));
      
      if (hasJsx) {
        const newPath = fullPath.replace(/\.js$/, '.jsx');
        
        // Atualizar referências em outros arquivos
        updateFileReferences(fullPath, newPath);
        
        // Renomear o arquivo
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed: ${fullPath} -> ${newPath}`);
      }
    }
  });
}

function updateFileReferences(oldPath, newPath) {
  const oldImportPath = oldPath
    .replace(/\.[^/.]+$/, '') // Remove a extensão
    .replace(/\\/g, '/'); // Converte barras para o formato de importação
    
  const newImportPath = newPath
    .replace(/\.[^/.]+$/, '')
    .replace(/\\/g, '/');

  // Atualiza as importações em todos os arquivos
  updateImportsInDirectory('src', oldImportPath, newImportPath);
}

function updateImportsInDirectory(directory, oldImportPath, newImportPath) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      updateImportsInDirectory(fullPath, oldImportPath, newImportPath);
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const updatedContent = content.replace(
        new RegExp(`(['"])${escapeRegExp(oldImportPath)}(['"])`, 'g'),
        `$1${newImportPath}$2`
      );
      
      if (content !== updatedContent) {
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log(`Updated imports in: ${fullPath}`);
      }
    }
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Inicia o processamento a partir do diretório src
processDirectory('src');

console.log('JSX file renaming completed!');
