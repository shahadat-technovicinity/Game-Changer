"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const service_1 = require("./service");
const uploadCloudinary_1 = require("../utils/uploadCloudinary");
const appError_1 = require("../utils/appError");
const getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { items, paginationData } = await service_1.Service.getAll(req.query);
    res.status(200).json({ success: true, message: "Retrived all user successfully", data: items, pagination: paginationData });
});
const getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.user?._id;
    const item = await service_1.Service.getById(id);
    if (!item) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: { user: item },
    });
});
const blockUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const item = await service_1.Service.getById(id);
    if (!item) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    // Toggle is_deleted status
    item.is_deleted = !item.is_deleted;
    await item.save();
    return res.status(200).json({
        success: true,
        message: "User blocked/unblocked successfully",
        data: item,
    });
});
const update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { first_name, last_name, device_token } = req.body;
    const id = req.user?._id;
    // Validate required fields
    if (!first_name && !last_name && !device_token && !req.file) {
        throw new appError_1.AppError("At least one field must be provided", 400);
    }
    const payload = {};
    if (first_name)
        payload.first_name = first_name;
    if (last_name)
        payload.last_name = last_name;
    if (device_token)
        payload.device_token = device_token;
    if (req.file) {
        const uploadResult = await (0, uploadCloudinary_1.UploadCloudinary)(req.file);
        payload.image = uploadResult.secure_url;
    }
    const item = await service_1.Service.update(id, payload);
    if (!item) {
        throw new appError_1.AppError("User not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "User is updated successfully",
        data: item,
    });
});
const getUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const item = await service_1.Service.getById(id);
    if (!item) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: item,
    });
});
const updateUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { first_name, last_name, device_token, jersey_no } = req.body;
    const id = req.params.id;
    // Validate required fields
    if (!first_name && !last_name && !device_token && !req.file) {
        throw new appError_1.AppError("At least one field must be provided", 400);
    }
    const payload = {};
    if (first_name)
        payload.first_name = first_name;
    if (last_name)
        payload.last_name = last_name;
    if (device_token)
        payload.device_token = device_token;
    if (jersey_no)
        payload.jersey_no = jersey_no;
    if (req.file) {
        const uploadResult = await (0, uploadCloudinary_1.UploadCloudinary)(req.file);
        payload.image = uploadResult.secure_url;
    }
    const item = await service_1.Service.update(id, payload);
    if (!item) {
        throw new appError_1.AppError("User not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "User is updated successfully",
        data: item,
    });
});
exports.Controller = { getAll, getById, update, updateUserById, getUserById, blockUserById };
