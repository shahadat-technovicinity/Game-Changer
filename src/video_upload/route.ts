// routes/video.route.ts
import express from 'express';
import { Controller } from './controller';
import { checkStorageLimit } from '../middleware/checkStorage';
import { upload } from '../middleware/uploadFile'; // your multer middleware
import { protect } from '../middleware/auth';

const router = express.Router();

router.post(
  '/upload',
  protect,
  upload.single('video'),
  checkStorageLimit,
Controller.uploadVideo
);

export { router as videoRouter };
