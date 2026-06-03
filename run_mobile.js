const os = require('os');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Local IP Address nikalne ke liye
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1';
}

const ip = getLocalIP();
console.log(`\n======================================================`);
console.log(`🚀 STARTING AURA BITE FOR MOBILE (SAME WIFI) 🚀`);
console.log(`======================================================\n`);
console.log(`📱 Your PC's Local IP Address is: ${ip}`);
console.log(`⚠️  Dhyan rakhein: Mobile aur PC ek hi Wi-Fi se connected hone chahiye!\n`);

// 1. Frontend ke liye .env file create karte hain
const frontendDir = path.join(__dirname, 'project_', 'frontend');
const envFile = path.join(frontendDir, '.env');
fs.writeFileSync(envFile, `VITE_API_URL=http://${ip}:5000\n`);
console.log(`✅ Frontend API URL set to: http://${ip}:5000`);

const backendProc = spawn('node', ['server.js'], { cwd: path.join(__dirname, 'project_', 'backend'), stdio: 'inherit', shell: true });

// 3. Frontend Start karo (with --host to expose on network)
console.log(`⏳ Frontend server start ho raha hai...`);
const frontendProc = spawn('npm', ['run', 'dev', '--', '--host'], { cwd: frontendDir, stdio: 'inherit', shell: true });

console.log(`\n======================================================`);
console.log(`🎉 READY! Aap apne phone ke browser me ye link kholiye: 🎉`);
console.log(`👉 http://${ip}:5173`);
console.log(`======================================================\n`);

process.on('SIGINT', () => {
    backendProc.kill();
    frontendProc.kill();
    process.exit();
});
