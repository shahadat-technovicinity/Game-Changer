import express from 'express';
import { Controller } from './controller';
const router = express.Router();

// Public routes
router.get('/', Controller.getAllPackages);
router.get('/:id', Controller.getPackageById);

// Admin routes (protected)
router.post('/', Controller.create);
router.post('/:id', Controller.update);
router.delete('/:id', Controller.deactivatePackage);

export {router as storagePackageRouter};