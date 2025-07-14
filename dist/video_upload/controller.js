"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
// controllers/video.controller.ts
const uploadCloudinary_1 = require("../utils/uploadCloudinary"); // your cloudinary config
const model_1 = require("../users/model");
const model_2 = __importDefault(require("./model")); // your Video model
const model_3 = require("../events/model"); // import your Event mongoose model (adjust the path as needed)
const catchAsync_1 = require("../utils/catchAsync");
const uploadVideo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const fileSizeMB = req.body.uploadSizeMB;
    const eventId = req.body.event_id; // optional, if related to an event
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file provided' });
    }
    // Upload to Cloudinary
    const result = await (0, uploadCloudinary_1.UploadCloudinary)(req.file);
    // Save video record
    const video = await model_2.default.create({
        user: userId,
        url: result.secure_url,
        size: fileSizeMB,
        event_id: eventId,
    });
    await model_3.Event.findByIdAndUpdate(eventId, {
        $push: { uploaded_videos: video.url },
    });
    // Update user storage usage
    await model_1.User.findByIdAndUpdate(userId, {
        $inc: { storage_used: fileSizeMB },
    });
    res.status(200).json({
        success: true,
        message: 'Video uploaded successfully',
        video,
    });
});
exports.Controller = { uploadVideo };
