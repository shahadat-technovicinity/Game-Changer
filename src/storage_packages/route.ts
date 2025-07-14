import express from 'express';
import { Controller } from './controller';
import { upload } from "../middleware/uploadFile"
const router = express.Router();

// Public routes
router
    .route("/")
    .post(Controller.create)
    .get(Controller.getAllPackages);
router
    .route("/:id")
    .get(Controller.getPackageById)
    .post(Controller.update)
    .patch(Controller.deactivatePackage);
export {router as storagePackageRouter};
