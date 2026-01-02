// Run this file with: node create-admin.js
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

// Your database URL
const DATABASE_URL = 'postgresql://neondb_owner:npg_5e9SVAyLdoCz@ep-autumn-silence-afyg74wr-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require';

const sql = neon(DATABASE_URL);

async function createAdmin() {
  try {
    const username = 'admin';
    const password = 'Pentium1024$'; // CHANGE THIS!
    
    // Hash password
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    
    console.log('Creating admin user...');
    
    // Delete any existing admin user
    await sql`DELETE FROM admin_users WHERE username = ${username}`;
    
    // Create new admin user
    await sql`
      INSERT INTO admin_users (username, password)
      VALUES (${username}, ${hashedPassword})
    `;
    
    console.log('✅ Admin user created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('\nYou can now login at: http://localhost:4000/admin/login');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdmin();
