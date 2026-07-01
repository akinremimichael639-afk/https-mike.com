import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/Admin';
import { config } from '../config/env';

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const admin = await AdminModel.findByUsername(username);

      if (!admin) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        config.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        status: 'success',
        data: {
          token,
          admin: { id: admin.id, username: admin.username }
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Login failed' });
    }
  }
};
