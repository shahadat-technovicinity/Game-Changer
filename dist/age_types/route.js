"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ageTypesRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const uploadFile_1 = require("../middleware/uploadFile");
const router = express_1.default.Router();
exports.ageTypesRouter = router;
router
    .route("/")
    .post(uploadFile_1.upload.single("image"), controller_1.Controller.create)
    .get(controller_1.Controller.getAll);
router
    .route("/:id")
    .get(controller_1.Controller.getById)
    .post(uploadFile_1.upload.single("image"), controller_1.Controller.update)
    .delete(controller_1.Controller.remove);
