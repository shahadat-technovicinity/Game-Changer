import { Router } from 'express';
import { Controller } from './controller';
import { protect, restrictTo } from '../middleware/auth';
import { upload } from "../middleware/uploadFile"

const router = Router();

router.route('/')
    .post(protect,restrictTo("Admin","Coach"),upload.single("image"),Controller.create)
    .get(Controller.getAll);
router.route('/live')
    .get(Controller.getAllLive);
router.get('/admin', protect,restrictTo("Admin"),Controller.getAllByAdmin);
router.route('/:id')
    .get(Controller.getById)
    .post(protect,restrictTo("Admin","Coach"),Controller.update)
    .delete(protect,restrictTo("Admin","Coach"),Controller.remove);
router.route('/:id/live-toggle')
    .post(Controller.liveToggle);
router.route('/:id/upload-video')
    .post(upload.single("video"), Controller.uploadVideo);

router.get('/team/:team_id', Controller.getCreatedByTeam);
router.get('/opponent/:team_id', Controller.getCreatedByOpponent);
router.get('/all/:team_id', Controller.getTotalEventsOfTeam);


export {router as eventRouter};
