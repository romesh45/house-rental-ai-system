import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
}

export class AmenityModel {
  static async getAll(): Promise<Amenity[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM amenities ORDER BY name'
    );
    return rows as Amenity[];
  }

  static async findById(id: number): Promise<Amenity | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM amenities WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Amenity) : null;
  }
}
