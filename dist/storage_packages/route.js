"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storagePackageRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
exports.storagePackageRouter = router;
// Public routes
router
    .route("/")
    .post(controller_1.Controller.create)
    .get(controller_1.Controller.getAllPackages);
router
    .route("/:id")
    .get(controller_1.Controller.getPackageById)
    .post(controller_1.Controller.update)
    .patch(controller_1.Controller.deactivatePackage);
