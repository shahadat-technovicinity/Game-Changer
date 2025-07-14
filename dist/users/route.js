"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const auth_1 = require("../middleware/auth");
const uploadFile_1 = require("../middleware/uploadFile");
const router = express_1.default.Router();
exports.userRouter = router;
router
    .route("/")
    .get(auth_1.protect, controller_1.Controller.getById)
    .post(auth_1.protect, uploadFile_1.upload.single("image"), controller_1.Controller.update);
router
    .route("/all")
    .get(controller_1.Controller.getAll);
router
    .route("/:id")
    .get(controller_1.Controller.getUserById)
    .patch(controller_1.Controller.blockUserById)
    .post(uploadFile_1.upload.single("image"), controller_1.Controller.updateUserById);
