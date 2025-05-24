import multer from "multer";
import path from "path";
import { Request } from "express";
import { FileFilterCallback } from "multer";
import { AppError } from "../utils/appError";

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 2097152;
const ALLOWED_FILE_TYPE = process.env.ALLOWED_FILE_TYPE || [
  "jpeg",
  "jpg",
  "png",
];

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, process.env.UPLOAD_FILE || "public/images/users");
  // },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    //console.log("file: ", file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const extname = path.extname(file.originalname);
  if (!ALLOWED_FILE_TYPE.includes(extname.substring(1))) {
    return cb(new AppError("This type of images is not allowed", 400));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
export { upload };
