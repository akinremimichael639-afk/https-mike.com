import app from './app';
import { config } from './config/env';
import pool from './config/db';

const startServer = async () => {
  try {
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
