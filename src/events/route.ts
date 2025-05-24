import { Router } from 'express';
import { Controller } from './controller';
import { protect, restrictTo } from '../middleware/auth';
import { upload } from "../middleware/uploadFile"

const router = Router();

router.route('/')
    .post(protect,restrictTo("Admin"),upload.single("image"),Controller.create)
    .get(Controller.getAll);
router.route('/:id')
    .get(Controller.getById)
    .post(protect,restrictTo("Admin"),Controller.update)
    .delete(protect,restrictTo("Admin"),Controller.remove);
router.get('/team/:team_id', Controller.getCreatedByTeam);
router.get('/opponent/:team_id', Controller.getCreatedByOpponent);
router.get('/all/:team_id', Controller.getTotalEventsOfTeam);

export {router as eventRouter};
