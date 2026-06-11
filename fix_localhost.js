const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'project_/frontend/src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(dir);
let modifiedFiles = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("import.meta.env.VITE_API_URL || 'http://localhost:5000'")) {
    content = content.replace(/import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'/g, "import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')");
    fs.writeFileSync(file, content);
    modifiedFiles++;
    console.log('Modified', file);
  }
});
console.log('Total modified:', modifiedFiles);
