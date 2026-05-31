const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);
const envStr = "${import.meta.env.VITE_API_URL || 'http://localhost:5000'}";
const envStrBare = "(import.meta.env.VITE_API_URL || 'http://localhost:5000')";

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace 'http://localhost:5000/api/...' -> `${...}/api/...`
    content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`' + envStr + '$1`');
    
    // Replace `http://localhost:5000/api/...` -> `${...}/api/...`
    content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`' + envStr + '$1`');

    // Replace strict string 'http://localhost:5000' -> (import...)
    content = content.replace(/'http:\/\/localhost:5000'/g, envStrBare);

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
    }
});

console.log('Done!');
