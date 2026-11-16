import { Router } from 'express';
import { busModelController } from '../controllers/busModel.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// All authenticated user roles can view bus models
router.get('/', authenticate, busModelController.getAllBusModels);

// Admin only: create new bus model
router.post('/', authenticate, requireAdmin, busModelController.createBusModel);

// Admin only: update existing bus model
router.put('/:id', authenticate, requireAdmin, busModelController.updateBusModel);

// Admin only: update fleet count (totalBusesCount) for a specific model
router.patch('/:id/fleet', authenticate, requireAdmin, busModelController.updateFleetCount);
router.put('/:id/fleet', authenticate, requireAdmin, busModelController.updateFleetCount);

export default router;
