"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.additionalRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const router = express_1.default.Router();
exports.additionalRouter = router;
// GET: Fetch Page by Type (Privacy Policy, Terms & Conditions, FAQ)
router.get("/:type", controllers_1.getAdditionalByType);
// POST/PUT: Update or Create Page Content with multiple objects in body
router.post("/:type", controllers_1.createAdditionalByType);
// DELETE: Delete Page by Type
router.delete("/:type", controllers_1.deleteAdditionalByType);
// Edit a specific object in the body array
router.patch("/:type/:id", controllers_1.updateAdditionalById);
// Get a specific object in the body array
router.get("/:type/:id", controllers_1.getAdditionalById);
// DELETE: Delete Page by FAQ Type and inside seperate object
router.delete("/:type/:id", controllers_1.deleteAdditionalById);
