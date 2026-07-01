import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  PORT: process.env.PORT || 5000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || '',
  DB_NAME: process.env.DB_NAME || 'lasu_tag_db',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_lasu_key_12345',
};
