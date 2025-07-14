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
router.get('/', controller_1.Controller.getAllPackages);
router.get('/:id', controller_1.Controller.getPackageById);
// Admin routes (protected)
router.post('/', controller_1.Controller.create);
router.post('/:id', controller_1.Controller.update);
router.delete('/:id', controller_1.Controller.deactivatePackage);
