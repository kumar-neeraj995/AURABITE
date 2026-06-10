const { execSync } = require('child_process');

try {
  console.log('Installing backend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('Switching to frontend directory...');
  process.chdir('../frontend');

  console.log('Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('Building frontend...');
  // Force clearing npm_config_argv to prevent argument injection
  const env = { ...process.env };
  delete env.npm_config_argv;
  execSync('npm run build', { stdio: 'inherit', env });

  console.log('Build completed successfully.');
} catch (error) {
  console.error('Build failed!', error);
  process.exit(1);
}
