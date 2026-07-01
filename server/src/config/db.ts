import { Pool } from 'pg';
import { config } from './env';

console.log('Database Config:', {
  host: config.DB_HOST,
  user: config.DB_USER,
  database: config.DB_NAME,
  port: config.DB_PORT,
});

const pool = new Pool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
  port: config.DB_PORT,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
pool.on('connect', () => {
  console.log('✅ New client connected to pool');
});
});

export default pool;
