import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Service } from "./service";
import { UploadCloudinary } from "../utils/uploadCloudinary";
import { AppError } from "../utils/appError";
import { IAgeType } from "./model";

const create = catchAsync(async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    throw new AppError("The 'title' field is required", 400);
  }

  let imageUrl = "";

  if (req.file) {
    const uploadResult = await UploadCloudinary(req.file);
    imageUrl = uploadResult.secure_url;
  }

  const payload: Partial<IAgeType> = {
    title,
    image: imageUrl,
  };

  const item = await Service.create(payload);

  res.status(201).json({
    success: true,
    message: "Age type created successfully",
    data: item,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const {items,paginationData} = await Service.getAll(req.query);
  res.status(200).json({ success: true,message: "Retrived all age types successfully", data: items, pagination: paginationData });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await Service.getById(id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Age type not found" });
  }
  return res.status(200).json({
    success: true,
    message: "Age type retrieved successfully",
    data: item,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { title } = req.body;
  const { id } = req.params;

  // Validate required fields
  if (!title && !req.file) {
    throw new AppError("At least one field (title or image) must be provided", 400);
  }

  const payload: Partial<IAgeType> = {};

  if (title) payload.title = title;

  if (req.file) {
    const uploadResult = await UploadCloudinary(req.file);
    payload.image = uploadResult.secure_url;
  }

  const item = await Service.update(id, payload);

  if (!item) {
    throw new AppError("Age type not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Age type updated successfully",
    data: item,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const item = await Service.remove(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Age type not found" });
  }
  res.status(200).json({ success: true, message: "Age type deleted" });
});

export const Controller = { create, getAll, getById, update, remove };
