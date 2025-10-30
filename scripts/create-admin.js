/**
 * Script to create an admin user with hashed password
 *
 * Usage:
 *   node scripts/create-admin.js <email> <password> [name]
 *
 * Example:
 *   node scripts/create-admin.js persx@alexdesigns.com mypassword123 "Admin User"
 */

const bcrypt = require('bcryptjs');

// Get command line arguments
const [,, email, password, name = 'Admin User'] = process.argv;

if (!email || !password) {
  console.error('\n❌ Error: Email and password are required\n');
  console.log('Usage:');
  console.log('  node scripts/create-admin.js <email> <password> [name]\n');
  console.log('Example:');
  console.log('  node scripts/create-admin.js persx@alexdesigns.com mypassword123 "Admin User"\n');
  process.exit(1);
}

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('\n❌ Error: Invalid email format\n');
  process.exit(1);
}

// Validate password length
if (password.length < 8) {
  console.error('\n❌ Error: Password must be at least 8 characters long\n');
  process.exit(1);
}

console.log('\n🔐 Generating password hash...\n');

// Generate password hash
bcrypt.hash(password, 10).then(hash => {
  console.log('✅ Password hash generated successfully!\n');
  console.log('📋 Copy and paste this SQL into your Supabase SQL Editor:\n');
  console.log('─'.repeat(70));
  console.log();
  console.log('INSERT INTO admin_users (email, password_hash, name, is_active)');
  console.log('VALUES (');
  console.log(`  '${email}',`);
  console.log(`  '${hash}',`);
  console.log(`  '${name}',`);
  console.log(`  true`);
  console.log(');');
  console.log();
  console.log('─'.repeat(70));
  console.log();
  console.log('✅ Admin user credentials:');
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Name:     ${name}`);
  console.log();
  console.log('⚠️  IMPORTANT: Change this password after first login!');
  console.log('   You can use the "Forgot Password" feature at /go\n');
}).catch(error => {
  console.error('\n❌ Error generating password hash:', error);
  process.exit(1);
});
