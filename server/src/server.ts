import app from './app';
import { config } from './config/env';
import pool from './config/db';
import { initializeDatabase } from './db-init';

const startServer = async () => {
  try {
    // Initialize database schema and seed
    await initializeDatabase();
    
    // Test DB Connection
    const client = await pool.connect();
    client.release();
    console.log('✅ PostgreSQL database connected successfully.');

    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
