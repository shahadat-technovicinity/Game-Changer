"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const appError_1 = require("./appError");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dnfgu6ltf",
    api_key: process.env.CLOUDINARY_API_KEY || "877988418139969",
    api_secret: process.env.CLOUDINARY_API_SECRET || "sD7CJwuR_O2en0mYp0W5uN-aUiw",
});
/**
 * Uploads a file to Cloudinary and returns its secure URL
 * @param file Express.Multer.File
 * @returns Cloudinary upload result
 */
const UploadCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new appError_1.AppError("No file provided for upload", 400));
        }
        cloudinary_1.v2.uploader.upload(file.path, {
            resource_type: "auto", // 'image', 'video', or 'auto'
            folder: "game-changer-uploads",
        }, (error, result) => {
            if (error || !result?.secure_url) {
                return reject(new appError_1.AppError("Image upload failed", 500));
            }
            resolve({ secure_url: result.secure_url });
        });
    });
};
exports.UploadCloudinary = UploadCloudinary;
