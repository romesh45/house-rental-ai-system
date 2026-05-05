import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Property {
  id?: number;
  owner_id: number;
  title: string;
  description?: string;
  property_type: 'apartment' | 'house' | 'villa' | 'studio' | 'penthouse';
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  rent_amount: number;
  security_deposit?: number;
  area_sqft?: number;
  bedrooms: number;
  bathrooms: number;
  is_available?: boolean;
  available_from?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface PropertyWithDetails extends Property {
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  images?: string[];
  amenities?: Array<{ id: number; name: string; icon: string }>;
}

export class PropertyModel {
  static async create(property: Property): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO properties (owner_id, title, description, property_type, address, city, state, pincode, 
       latitude, longitude, rent_amount, security_deposit, area_sqft, bedrooms, bathrooms, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        property.owner_id, property.title, property.description || null, property.property_type,
        property.address, property.city, property.state, property.pincode,
        property.latitude || null, property.longitude || null,
        property.rent_amount, property.security_deposit || null, property.area_sqft || null,
        property.bedrooms, property.bathrooms, property.is_available !== false
      ]
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<PropertyWithDetails | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*, u.full_name as owner_name, u.phone as owner_phone, u.email as owner_email
       FROM properties p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) return null;

    const property = rows[0] as PropertyWithDetails;

    // Get images
    const [images] = await pool.execute<RowDataPacket[]>(
      'SELECT image_url FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, display_order',
      [id]
    );
    property.images = images.map(img => img.image_url);

    // Get amenities
    const [amenities] = await pool.execute<RowDataPacket[]>(
      `SELECT a.id, a.name, a.icon FROM amenities a
       JOIN property_amenities pa ON a.id = pa.amenity_id
       WHERE pa.property_id = ?`,
      [id]
    );
    property.amenities = amenities as Array<{ id: number; name: string; icon: string }>;

    return property;
  }

  static async search(filters: any): Promise<PropertyWithDetails[]> {
    let query = `
      SELECT p.*, u.full_name as owner_name,
      (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.is_available = 1
    `;
    const params: any[] = [];

    if (filters.city) {
      query += ' AND p.city LIKE ?';
      params.push(`%${filters.city}%`);
    }

    if (filters.minRent) {
      query += ' AND p.rent_amount >= ?';
      params.push(filters.minRent);
    }

    if (filters.maxRent) {
      query += ' AND p.rent_amount <= ?';
      params.push(filters.maxRent);
    }

    if (filters.property_type) {
      query += ' AND p.property_type = ?';
      params.push(filters.property_type);
    }

    if (filters.bedrooms) {
      query += ' AND p.bedrooms >= ?';
      params.push(filters.bedrooms);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      const amenityIds = filters.amenities.split(',');
      query += ` AND p.id IN (
        SELECT property_id FROM property_amenities 
        WHERE amenity_id IN (${amenityIds.map(() => '?').join(',')})
        GROUP BY property_id
        HAVING COUNT(DISTINCT amenity_id) = ?
      )`;
      params.push(...amenityIds, amenityIds.length);
    }

    query += ' ORDER BY p.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows as PropertyWithDetails[];
  }

  static async getByOwnerId(ownerId: number): Promise<PropertyWithDetails[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*,
       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM properties p
       WHERE p.owner_id = ?
       ORDER BY p.created_at DESC`,
      [ownerId]
    );
    return rows as PropertyWithDetails[];
  }

  static async update(id: number, updates: Partial<Property>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'owner_id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE properties SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM properties WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async addImage(propertyId: number, imageUrl: string, isPrimary: boolean = false): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, ?)',
      [propertyId, imageUrl, isPrimary]
    );
    return result.insertId;
  }

  static async addAmenities(propertyId: number, amenityIds: number[]): Promise<void> {
    if (amenityIds.length === 0) return;

    const placeholders = amenityIds.map(() => '(?, ?)').join(',');
    const values = amenityIds.flatMap(amenityId => [propertyId, amenityId]);
    await pool.execute(
      `INSERT INTO property_amenities (property_id, amenity_id) VALUES ${placeholders}`,
      values
    );
  }

  static async removeAmenities(propertyId: number): Promise<void> {
    await pool.execute('DELETE FROM property_amenities WHERE property_id = ?', [propertyId]);
  }
}
