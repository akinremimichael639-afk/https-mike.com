import pool from '../config/db';

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export const AdminModel = {
  findByUsername: async (username: string): Promise<Admin | null> => {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) return null;
    return result.rows[0] as Admin;
  }
};
