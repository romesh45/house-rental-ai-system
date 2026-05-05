import { Response } from 'express';
import { AmenityModel } from '../models/amenity.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class AmenityController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const amenities = await AmenityModel.getAll();

      res.json({
        count: amenities.length,
        amenities
      });
    } catch (error: any) {
      console.error('Get amenities error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}
