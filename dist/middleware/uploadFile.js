"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const appError_1 = require("../utils/appError");
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 2097152;
const ALLOWED_FILE_TYPE = process.env.ALLOWED_FILE_TYPE || [
    "jpeg",
    "jpg",
    "png",
];
const storage = multer_1.default.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, process.env.UPLOAD_FILE || "public/images/users");
    // },
    filename: function (req, file, cb) {
        const extname = path_1.default.extname(file.originalname);
        //console.log("file: ", file.originalname);
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    const extname = path_1.default.extname(file.originalname);
    if (!ALLOWED_FILE_TYPE.includes(extname.substring(1))) {
        return cb(new appError_1.AppError("This type of images is not allowed", 400));
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
});
exports.upload = upload;
