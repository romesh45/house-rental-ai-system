import express from 'express';
import { AmenityController } from '../controllers/amenity.controller';

const router = express.Router();

router.get('/', AmenityController.getAll);

export default router;
