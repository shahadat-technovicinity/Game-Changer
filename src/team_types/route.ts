import express from "express";
import { Controller } from "./controller";
import { upload } from "../middleware/uploadFile"

const router = express.Router();

router
    .route("/")
    .post(upload.single("image"),Controller.create)
    .get(Controller.getAll);
router
    .route("/:id")
    .get(Controller.getById)
    .post(upload.single("image"),Controller.update)
    .delete(Controller.remove);
export {router as teamTypesRouter};
