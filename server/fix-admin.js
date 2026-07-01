const mysql = require('mysql2/promise');

async function fixAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Assuming default or no password as they didn't create a .env yet
      database: 'lasu_tag_db'
    });
    
    await connection.query(
      "UPDATE admins SET password_hash = ? WHERE username = 'admin'",
      ['$2b$10$9H3GkIGfotNujbSTrPG5SuomaJ3CTbQLBOodQpxJFIeze/9mAKn6C']
    );
    console.log('Admin password updated to admin123');
    await connection.end();
  } catch (error) {
    console.error('Error updating admin:', error.message);
  }
}

fixAdmin();
