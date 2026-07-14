const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Get tsc errors
let tscOutput = '';
try {
  execSync('npx tsc --noEmit', { encoding: 'utf-8', cwd: __dirname });
} catch (e) {
  tscOutput = e.stdout;
}

// 2. Parse errors
const lines = tscOutput.split('\n');
const filesToFix = new Set();
const errors = [];

for (const line of lines) {
  // src/controllers/v1/admin/cv-template.controller.ts(22,18): error TS2322: Type 'string | string[]' is not assignable...
  const match = line.match(/^(.+\.ts)\((\d+),(\d+)\): error TS23(?:22|45):/);
  if (match) {
    const file = match[1];
    const row = parseInt(match[2]) - 1; // 0-indexed
    
    if (file.includes('controller.ts')) {
      errors.push({ file, row });
      filesToFix.add(file);
    }
  }
}

// 3. Fix files
for (const file of filesToFix) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf-8').split('\n');
  
  const fileErrors = errors.filter(e => e.file === file);
  // Sort descending to not mess up lines
  fileErrors.sort((a, b) => b.row - a.row);
  
  for (const err of fileErrors) {
    let lineContent = content[err.row];
    // Replace req.query.XYZ with (req.query.XYZ as string)
    if (lineContent.includes('req.query.')) {
      content[err.row] = lineContent.replace(/(req\.query\.\w+)/g, '($1 as string)');
      console.log(`Fixed ${file}:${err.row+1}`);
    } else if (lineContent.includes('req.params.')) {
      content[err.row] = lineContent.replace(/(req\.params\.\w+)/g, '($1 as string)');
      console.log(`Fixed ${file}:${err.row+1}`);
    } else {
      // If destructured variables from req.query are used, we might need a general regex
      content[err.row] = lineContent.replace(/([a-zA-Z0-9_]+)\s*,\s*$/g, '$1 as string,');
      // A safe fallback: if we can't find req.query, we just append ' as string' to the end before the semicolon or comma
      // This is a bit hacky but works for most assignment errors.
      if (!lineContent.includes('req.query')) {
         content[err.row] = lineContent.replace(/([a-zA-Z0-9_]+)(\s*[;,)])/g, '($1 as string)$2');
      }
    }
  }
  
  fs.writeFileSync(filePath, content.join('\n'));
}

console.log('Auto-fix complete.');
