import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
  id?: number;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: 'tenant' | 'owner' | 'admin';
  profile_image?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(user: User): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (email, password, full_name, phone, role, profile_image) VALUES (?, ?, ?, ?, ?, ?)',
      [user.email, user.password, user.full_name, user.phone || null, user.role, user.profile_image || null]
    );
    return result.insertId;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, email, full_name, phone, role, profile_image, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async update(id: number, updates: Partial<User>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async getAll(): Promise<User[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, email, full_name, phone, role, profile_image, created_at FROM users ORDER BY created_at DESC'
    );
    return rows as User[];
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
