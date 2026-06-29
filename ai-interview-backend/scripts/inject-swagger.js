const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../src/routes/v1');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(routesDir, function(err, files) {
  if (err) throw err;
  const routeFiles = files.filter(f => f.endsWith('.route.ts') || f.endsWith('.routes.ts'));
  
  routeFiles.forEach(file => {
    // Skip auth because we already did it perfectly
    if (file.includes('auth.route.ts')) return;
    
    let content = fs.readFileSync(file, 'utf-8');
    let lines = content.split('\n');
    let newLines = [];
    
    // Add file level tag if missing
    let hasTag = false;
    for(let l of lines) {
      if(l.includes('@swagger') && l.includes('tags:')) { hasTag = true; break; }
    }
    
    const baseName = path.basename(file).split('.')[0];
    const tag = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    
    if (!hasTag) {
      newLines.push('/**');
      newLines.push(' * @swagger');
      newLines.push(' * tags:');
      newLines.push(` *   name: ${tag}`);
      newLines.push(` *   description: API cho ${tag}`);
      newLines.push(' */\n');
    }
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let match = line.match(/^router\.(get|post|put|patch|delete)\(\s*['"](.*?)['"]/);
      
      if (match) {
        // Check if previous lines have JSDoc
        let hasJSDoc = false;
        let prevLine = i > 0 ? lines[i-1].trim() : '';
        if (prevLine === '*/' || prevLine.endsWith(');') || line.includes('/*')) {
          // If it ends with */, it probably has JSDoc. 
          // Wait, actually let's check a few lines up
          for(let k=1; k<=5 && i-k >= 0; k++){
             if(lines[i-k].trim() === '/**') hasJSDoc = true;
          }
        }
        
        if (!hasJSDoc) {
          const method = match[1];
          const subPath = match[2];
          
          let fullPath = subPath; // We don't know the exact full path, so we'll use a placeholder or generic
          
          newLines.push('/**');
          newLines.push(' * @swagger');
          newLines.push(` * # Thêm đường dẫn thực tế thay cho {basePath}${subPath}`);
          newLines.push(` * # path: {basePath}${subPath}:`);
          newLines.push(` * #   ${method}:`);
          newLines.push(` * #     summary: API ${method.toUpperCase()} ${subPath}`);
          newLines.push(` * #     tags: [${tag}]`);
          newLines.push(` * #     responses:`);
          newLines.push(` * #       200:`);
          newLines.push(` * #         description: Thành công`);
          newLines.push(' */');
        }
      }
      newLines.push(line);
    }
    
    fs.writeFileSync(file, newLines.join('\n'));
    console.log(`Injected JSDoc template to ${path.basename(file)}`);
  });
});
