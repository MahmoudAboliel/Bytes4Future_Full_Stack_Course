import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import busModelRoutes from './busModel.routes.js';
import tripRoutes from './trip.routes.js';
import bookingRoutes from './booking.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bus-models', busModelRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);

export default router;
