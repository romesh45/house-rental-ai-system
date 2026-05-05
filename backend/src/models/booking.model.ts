import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface BookingRequest {
  id?: number;
  property_id: number;
  tenant_id: number;
  owner_id: number;
  move_in_date: Date;
  message?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
}

export interface BookingWithDetails extends BookingRequest {
  property_title?: string;
  property_address?: string;
  property_rent?: number;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
  owner_name?: string;
}

export class BookingModel {
  static async create(booking: BookingRequest): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO booking_requests (property_id, tenant_id, owner_id, move_in_date, message, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        booking.property_id, booking.tenant_id, booking.owner_id,
        booking.move_in_date, booking.message || null, booking.status || 'pending'
      ]
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<BookingWithDetails | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT br.*, 
       p.title as property_title, p.address as property_address, p.rent_amount as property_rent,
       t.full_name as tenant_name, t.email as tenant_email, t.phone as tenant_phone,
       o.full_name as owner_name
       FROM booking_requests br
       LEFT JOIN properties p ON br.property_id = p.id
       LEFT JOIN users t ON br.tenant_id = t.id
       LEFT JOIN users o ON br.owner_id = o.id
       WHERE br.id = ?`,
      [id]
    );
    return rows.length > 0 ? (rows[0] as BookingWithDetails) : null;
  }

  static async getByTenantId(tenantId: number): Promise<BookingWithDetails[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT br.*, 
       p.title as property_title, p.address as property_address, p.rent_amount as property_rent,
       o.full_name as owner_name
       FROM booking_requests br
       LEFT JOIN properties p ON br.property_id = p.id
       LEFT JOIN users o ON br.owner_id = o.id
       WHERE br.tenant_id = ?
       ORDER BY br.created_at DESC`,
      [tenantId]
    );
    return rows as BookingWithDetails[];
  }

  static async getByOwnerId(ownerId: number): Promise<BookingWithDetails[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT br.*, 
       p.title as property_title, p.address as property_address, p.rent_amount as property_rent,
       t.full_name as tenant_name, t.email as tenant_email, t.phone as tenant_phone
       FROM booking_requests br
       LEFT JOIN properties p ON br.property_id = p.id
       LEFT JOIN users t ON br.tenant_id = t.id
       WHERE br.owner_id = ?
       ORDER BY br.created_at DESC`,
      [ownerId]
    );
    return rows as BookingWithDetails[];
  }

  static async updateStatus(id: number, status: string): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE booking_requests SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async checkExisting(propertyId: number, tenantId: number): Promise<BookingRequest | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM booking_requests WHERE property_id = ? AND tenant_id = ? AND status = ?',
      [propertyId, tenantId, 'pending']
    );
    return rows.length > 0 ? (rows[0] as BookingRequest) : null;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM booking_requests WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
