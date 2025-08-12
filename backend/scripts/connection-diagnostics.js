// Connection Test Script
// This script tests the frontend-backend connection issues

console.log(' RESONA MUSIC - CONNECTION DIAGNOSTICS');
console.log('========================================');

// 1. Test Environment Variables
console.log('\n1️ ENVIRONMENT VARIABLES:');
console.log('Frontend should have:');
console.log('  VITE_API_URL=https://basic-project-3-music-player-production.up.railway.app');
console.log('');
console.log('Backend should have:');
console.log('  ALLOWED_ORIGINS=https://resona-music.vercel.app,https://resona-music-git-main-pranavs-projects-55eb1917.vercel.app');
console.log('  MONGO_URL=mongodb+srv://...');
console.log('  JWT_SECRET=...');

// 2. Test URLs
console.log('\n2️ URLS TO TEST:');
console.log('Backend Health: https://basic-project-3-music-player-production.up.railway.app/health');
console.log('Backend Login: https://basic-project-3-music-player-production.up.railway.app/api/auth/login');
console.log('Frontend: https://resona-music.vercel.app');

// 3. Admin Credentials
console.log('\n3️ ADMIN CREDENTIALS:');
console.log('Option 1 - Original Admin:');
console.log('  Email: admin@resona.com');
console.log('  Password: admin123');
console.log('');
console.log('Option 2 - New Admin:');
console.log('  Email: pranav@resona.com');
console.log('  Password: pranav@123!');

// 4. Fix Instructions
console.log('\n4️ TO FIX:');
console.log('A. Railway Environment Variables:');
console.log('   1. Go to railway.app dashboard');
console.log('   2. Select your project');
console.log('   3. Go to Variables tab');
console.log('   4. Add/Update: ALLOWED_ORIGINS=https://resona-music.vercel.app');
console.log('');
console.log('B. Vercel Environment Variables:');
console.log('   1. Go to vercel.com dashboard');
console.log('   2. Select resona-music project');
console.log('   3. Go to Settings > Environment Variables');
console.log('   4. Add: VITE_API_URL=https://basic-project-3-music-player-production.up.railway.app');
console.log('   5. Redeploy frontend');

// 5. Quick Test Commands
console.log('\n5️ QUICK TESTS:');
console.log('Test backend health:');
console.log('  curl https://basic-project-3-music-player-production.up.railway.app/health');
console.log('');
console.log('Test login:');
console.log(`  curl -X POST https://basic-project-3-music-player-production.up.railway.app/api/auth/login \\
    -H "Content-Type: application/json" \\
    -H "Origin: https://resona-music.vercel.app" \\
    -d '{"email":"pranav@resona.com","password":"pranav@123!"}'`);

console.log('\n After fixing environment variables, both login and music should work!');
