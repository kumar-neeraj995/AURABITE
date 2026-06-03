const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace the specific hardcoded pinggy URL back to the environment variable fallback
    content = content.replace(/'https:\/\/ckksi-14-139-228-10\.run\.pinggy-free\.link'/g, "import.meta.env.VITE_API_URL || 'http://localhost:5000'");
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Restored URLs in:', file);
    }
});

console.log('Done restoring URLs!');
