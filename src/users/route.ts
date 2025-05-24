import express from "express";
import { Controller } from "./controller";
import { protect} from '../middleware/auth';
import { upload } from "../middleware/uploadFile";

const router = express.Router();

router
    .route("/")
    .get(protect,Controller.getById)
    .post(protect,upload.single("image"),Controller.update);
router
    .route("/all")
    .get(Controller.getAll);
export {router as userRouter};
