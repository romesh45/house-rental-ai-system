import { Response } from 'express';
import { BookingModel } from '../models/booking.model';
import { PropertyModel } from '../models/property.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { body, validationResult } from 'express-validator';

export class BookingController {
  static validateBooking = [
    body('property_id').isInt().withMessage('Valid property ID is required'),
    body('move_in_date').isISO8601().withMessage('Valid move-in date is required')
  ];

  static async create(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { property_id, move_in_date, message } = req.body;

      const property = await PropertyModel.findById(property_id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      if (!property.is_available) {
        return res.status(400).json({ message: 'Property is not available' });
      }

      const existingBooking = await BookingModel.checkExisting(property_id, req.user!.id);
      if (existingBooking) {
        return res.status(400).json({ message: 'You already have a pending booking request for this property' });
      }

      const bookingId = await BookingModel.create({
        property_id,
        tenant_id: req.user!.id,
        owner_id: property.owner_id,
        move_in_date: new Date(move_in_date),
        message,
        status: 'pending'
      });

      const booking = await BookingModel.findById(bookingId);

      res.status(201).json({
        message: 'Booking request created successfully',
        booking
      });
    } catch (error: any) {
      console.error('Create booking error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getMyBookings(req: AuthRequest, res: Response) {
    try {
      const bookings = await BookingModel.getByTenantId(req.user!.id);

      res.json({
        count: bookings.length,
        bookings
      });
    } catch (error: any) {
      console.error('Get my bookings error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getReceivedBookings(req: AuthRequest, res: Response) {
    try {
      const bookings = await BookingModel.getByOwnerId(req.user!.id);

      res.json({
        count: bookings.length,
        bookings
      });
    } catch (error: any) {
      console.error('Get received bookings error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;

      if (!['approved', 'rejected', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const booking = await BookingModel.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Only owner can approve/reject, tenant can cancel
      if (status === 'cancelled' && booking.tenant_id !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      if ((status === 'approved' || status === 'rejected') && booking.owner_id !== req.user!.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await BookingModel.updateStatus(bookingId, status);

      const updatedBooking = await BookingModel.findById(bookingId);

      res.json({
        message: 'Booking status updated successfully',
        booking: updatedBooking
      });
    } catch (error: any) {
      console.error('Update booking status error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await BookingModel.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.tenant_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await BookingModel.delete(bookingId);

      res.json({ message: 'Booking deleted successfully' });
    } catch (error: any) {
      console.error('Delete booking error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}
