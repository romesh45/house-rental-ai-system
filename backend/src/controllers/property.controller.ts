import { Response } from 'express';
import { PropertyModel } from '../models/property.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { body, validationResult } from 'express-validator';

export class PropertyController {
  static validateProperty = [
    body('title').notEmpty().withMessage('Title is required'),
    body('property_type').isIn(['apartment', 'house', 'villa', 'studio', 'penthouse']).withMessage('Invalid property type'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('pincode').notEmpty().withMessage('Pincode is required'),
    body('rent_amount').isFloat({ min: 0 }).withMessage('Rent amount must be a positive number'),
    body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a positive integer'),
    body('bathrooms').isInt({ min: 0 }).withMessage('Bathrooms must be a positive integer')
  ];

  static async create(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (req.body.amenities && typeof req.body.amenities === 'string') {
        try {
          req.body.amenities = JSON.parse(req.body.amenities);
        } catch (e) {
          req.body.amenities = [];
        }
      }

      const propertyData = {
        ...req.body,
        owner_id: req.user!.id
      };

      const propertyId = await PropertyModel.create(propertyData);

      if (req.body.amenities && Array.isArray(req.body.amenities)) {
        await PropertyModel.addAmenities(propertyId, req.body.amenities);
      }

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const imageUrl = `/uploads/${file.filename}`;
          await PropertyModel.addImage(propertyId, imageUrl, i === 0);
        }
      }

      const property = await PropertyModel.findById(propertyId);

      res.status(201).json({
        message: 'Property created successfully',
        property
      });
    } catch (error: any) {
      console.error('Create property error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      const filters = {
        city: req.query.city as string,
        minRent: req.query.minRent as string,
        maxRent: req.query.maxRent as string,
        property_type: req.query.property_type as string,
        bedrooms: req.query.bedrooms as string,
        amenities: req.query.amenities as string,
        limit: req.query.limit as string
      };

      const properties = await PropertyModel.search(filters);

      res.json({
        count: properties.length,
        properties
      });
    } catch (error: any) {
      console.error('Get properties error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }
      const property = await PropertyModel.findById(propertyId);

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      res.json({ property });
    } catch (error: any) {
      console.error('Get property error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  static async getMyProperties(req: AuthRequest, res: Response) {
    try {
      const properties = await PropertyModel.getByOwnerId(req.user!.id);

      res.json({
        count: properties.length,
        properties
      });
    } catch (error: any) {
      console.error('Get my properties error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }
      const property = await PropertyModel.findById(propertyId);

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      if (property.owner_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this property' });
      }

      const { amenities, images, ...updateData } = req.body;

      // Update property
      await PropertyModel.update(propertyId, updateData);

      // Update amenities if provided
      if (amenities && Array.isArray(amenities)) {
        await PropertyModel.removeAmenities(propertyId);
        await PropertyModel.addAmenities(propertyId, amenities);
      }

      const updatedProperty = await PropertyModel.findById(propertyId);

      res.json({
        message: 'Property updated successfully',
        property: updatedProperty
      });
    } catch (error: any) {
      console.error('Update property error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }
      const property = await PropertyModel.findById(propertyId);

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      if (property.owner_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this property' });
      }

      await PropertyModel.delete(propertyId);

      res.json({ message: 'Property deleted successfully' });
    } catch (error: any) {
      console.error('Delete property error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }

  static async uploadImages(req: AuthRequest, res: Response) {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }
      const property = await PropertyModel.findById(propertyId);

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      if (property.owner_id !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const imageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const imageUrl = `/uploads/${files[i].filename}`;
        await PropertyModel.addImage(propertyId, imageUrl, i === 0);
        imageUrls.push(imageUrl);
      }

      res.json({
        message: 'Images uploaded successfully',
        images: imageUrls
      });
    } catch (error: any) {
      console.error('Upload images error:', error);
      res.status(500).json({
        message: 'Server error',
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      });
    }
  }
}
