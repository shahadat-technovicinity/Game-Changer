"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouter = void 0;
// routes/video.route.ts
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const checkStorage_1 = require("../middleware/checkStorage");
const uploadFile_1 = require("../middleware/uploadFile"); // your multer middleware
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.videoRouter = router;
router.post('/upload', auth_1.protect, uploadFile_1.upload.single('video'), checkStorage_1.checkStorageLimit, controller_1.Controller.uploadVideo);
