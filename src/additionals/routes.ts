import express from "express";
import { getAdditionalByType,createAdditionalByType, deleteAdditionalByType, updateAdditionalById ,deleteAdditionalById, getAdditionalById} from "./controllers";
const router = express.Router();

// GET: Fetch Page by Type (Privacy Policy, Terms & Conditions, FAQ)
router.get("/:type", getAdditionalByType);

// POST/PUT: Update or Create Page Content with multiple objects in body
router.post("/:type", createAdditionalByType);

// DELETE: Delete Page by Type
router.delete("/:type", deleteAdditionalByType);

// Edit a specific object in the body array
router.patch("/:type/:id", updateAdditionalById);

// Get a specific object in the body array
router.get("/:type/:id", getAdditionalById);

// DELETE: Delete Page by FAQ Type and inside seperate object
router.delete("/:type/:id", deleteAdditionalById);

export { router as additionalRouter };
