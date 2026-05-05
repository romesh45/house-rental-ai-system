import express from 'express';
import authRoutes from './auth.routes';
import propertyRoutes from './property.routes';
import bookingRoutes from './booking.routes';
import amenityRoutes from './amenity.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/bookings', bookingRoutes);
router.use('/amenities', amenityRoutes);

export default router;
