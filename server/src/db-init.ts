import pool from './config/db';
import fs from 'fs';
import path from 'path';

export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('🔧 Initializing database...');
    
    // Read schema.sql
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Execute schema
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement + ';');
      }
    }
    console.log('✅ Schema initialized');
    
    // Read and execute seed.sql
    const seedPath = path.join(__dirname, '../../database/seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf-8');
    
    const seedStatements = seed.split(';').filter(stmt => stmt.trim());
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await client.query(statement + ';');
      }
    }
    console.log('✅ Seed data inserted');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};
