import { v2 as cloudinary } from "cloudinary";
import { AppError } from "./appError";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dnfgu6ltf",
  api_key: process.env.CLOUDINARY_API_KEY || "877988418139969",
  api_secret: process.env.CLOUDINARY_API_SECRET || "sD7CJwuR_O2en0mYp0W5uN-aUiw",
});

interface UploadResult {
  secure_url: string;
}

/**
 * Uploads a file to Cloudinary and returns its secure URL
 * @param file Express.Multer.File
 * @returns Cloudinary upload result
 */
export const UploadCloudinary = (
  file: Express.Multer.File
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new AppError("No file provided for upload", 400));
    }

    cloudinary.uploader.upload(file.path,{
        resource_type: "auto", // 'image', 'video', or 'auto'
        folder: "game-changer-uploads",
      }, (error, result) => {
      if (error || !result?.secure_url) {
        return reject(new AppError("Image upload failed", 500));
      }

      resolve({ secure_url: result.secure_url });
    });
  });
};
