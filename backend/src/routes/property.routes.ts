import express from 'express';
import { PropertyController } from '../controllers/property.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/', PropertyController.getAll);
router.get('/:id', PropertyController.getById);

// Protected routes - Owner only
router.post(
  '/',
  authMiddleware,
  roleMiddleware('owner', 'admin'),
  upload.array('images', 10),
  PropertyController.validateProperty,
  PropertyController.create
);

router.get(
  '/my/properties',
  authMiddleware,
  roleMiddleware('owner', 'admin'),
  PropertyController.getMyProperties
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('owner', 'admin'),
  PropertyController.update
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('owner', 'admin'),
  PropertyController.delete
);

router.post(
  '/:id/images',
  authMiddleware,
  roleMiddleware('owner', 'admin'),
  upload.array('images', 10),
  PropertyController.uploadImages
);

export default router;
