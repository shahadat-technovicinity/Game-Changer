import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Service } from "./service";
import { UploadCloudinary } from "../utils/uploadCloudinary";
import { AppError } from "../utils/appError";
import { IUser } from "./model";


const getAll = catchAsync(async (req: Request, res: Response) => {
  const {items,paginationData} = await Service.getAll(req.query);
  res.status(200).json({ success: true,message: "Retrived all user successfully", data: items, pagination: paginationData });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const  id  = req.user?._id;
  const item = await Service.getById(id);
  if (!item) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: item,
  });
});
const blockUserById = catchAsync(async (req: Request, res: Response) => {
  const  id  = req.params.id;
  const item = await Service.getById(id);
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

const update = catchAsync(async (req: Request, res: Response) => {
  const { first_name, last_name, device_token } = req.body;
  const  id  = req.user?._id;

  // Validate required fields
  if (!first_name && !last_name && !device_token && !req.file) {
    throw new AppError("At least one field must be provided", 400);
  }

  const payload: Partial<IUser> = {};

  if (first_name) payload.first_name = first_name;
  if (last_name) payload.last_name = last_name;
  if (device_token) payload.device_token = device_token;

  if (req.file) {
    const uploadResult = await UploadCloudinary(req.file);
    payload.image = uploadResult.secure_url;
  }

  const item = await Service.update(id, payload);

  if (!item) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User is updated successfully",
    data: item,
  });
});
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const  id  = req.params.id;
  const item = await Service.getById(id);
  if (!item) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: item,
  });
});

const updateUserById  = catchAsync(async (req: Request, res: Response) => {
  const { first_name, last_name, device_token } = req.body;
  const  id  = req.params.id;

  // Validate required fields
  if (!first_name && !last_name && !device_token && !req.file) {
    throw new AppError("At least one field must be provided", 400);
  }

  const payload: Partial<IUser> = {};

  if (first_name) payload.first_name = first_name;
  if (last_name) payload.last_name = last_name;
  if (device_token) payload.device_token = device_token;

  if (req.file) {
    const uploadResult = await UploadCloudinary(req.file);
    payload.image = uploadResult.secure_url;
  }

  const item = await Service.update(id, payload);

  if (!item) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User is updated successfully",
    data: item,
  });
});



export const Controller = { getAll, getById, update, updateUserById,getUserById,blockUserById };
