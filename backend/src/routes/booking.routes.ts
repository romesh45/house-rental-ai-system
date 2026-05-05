import express from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Tenant routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware('tenant'),
  BookingController.validateBooking,
  BookingController.create
);

router.get(
  '/my-bookings',
  authMiddleware,
  roleMiddleware('tenant'),
  BookingController.getMyBookings
);

// Owner routes
router.get(
  '/received',
  authMiddleware,
  roleMiddleware('owner'),
  BookingController.getReceivedBookings
);

// Both tenant and owner can update status
router.put(
  '/:id/status',
  authMiddleware,
  BookingController.updateStatus
);

router.delete(
  '/:id',
  authMiddleware,
  BookingController.delete
);

export default router;
