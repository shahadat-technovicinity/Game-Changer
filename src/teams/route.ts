import { Router } from 'express';
import {Controller} from './controller';
import { protect, restrictTo } from '../middleware/auth';
import { upload } from "../middleware/uploadFile";

const router = Router();
router.route('/')
        .post(protect,restrictTo("Admin"),upload.single("image"),Controller.create)
        .get(Controller.getAll);
router.route('/own-teams')
        .get(protect,restrictTo("Admin", "Coach"),Controller.getOwnTeams);
router.route('/:id')
        .post(protect,restrictTo("Admin"),upload.single("image"),Controller.update)
        .get(Controller.getById)
        .delete(protect,restrictTo("Admin"),Controller.remove);
router.route('/:id/player')
        .post(protect,restrictTo("Admin", "Coach"),Controller.addPlayer)
        .get(Controller.getPlayers);
router.route('/:id/coach')
        .post(protect,restrictTo("Admin"),Controller.addCoach)
        .get(Controller.getCoachs);

router.delete('/:id/player/:player_id', protect, restrictTo("Admin"), Controller.removePlayer);

export {router as teamRouter };
