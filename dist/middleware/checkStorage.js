"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStorageLimit = void 0;
const model_1 = require("../users/model");
const catchAsync_1 = require("../utils/catchAsync");
exports.checkStorageLimit = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: user ID missing' });
    }
    // Multer should have set req.file
    if (!req.file || !req.file.size) {
        return res.status(400).json({ success: false, message: 'No file uploaded or file size missing' });
    }
    const fileSizeMB = req.file.size / (1024 * 1024); // convert bytes to MB
    const user = await model_1.User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Check if required fields exist
    if (typeof user.storage_size !== 'number' || typeof user.storage_used !== 'number') {
        return res.status(500).json({ success: false, message: 'User storage info is incomplete' });
    }
    const maxStorageMB = user.storage_size * 1024; // Convert GB to MB
    const availableStorageMB = maxStorageMB - user.storage_used;
    if (fileSizeMB > availableStorageMB) {
        return res.status(403).json({
            success: false,
            message: `Upload too large. Available: ${availableStorageMB.toFixed(2)} MB, Required: ${fileSizeMB.toFixed(2)} MB. Please upgrade your storage package.`,
        });
    }
    // Attach the size to request for later use
    req.body.uploadSizeMB = fileSizeMB;
    next();
});
