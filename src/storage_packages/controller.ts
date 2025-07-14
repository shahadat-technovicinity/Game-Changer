import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { StoragePackage, IStoragePackage } from './model';
import { queryHelper } from "../utils/queryHelper";

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
    try {
      const { skip, limit, finalQuery, sortQuery, page } = queryHelper(req.query);
      const filter = { is_active: true, ...finalQuery };
      
        const [items, totalItems] = await Promise.all([
          StoragePackage.find(filter).sort(sortQuery).skip(skip).limit(limit),
          StoragePackage.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        const paginationData = {
          totalItems,
          totalPages,
          currentPage: page,
          limit,
        };
        res.status(200).json({ success: true,message: "Retrived all storage packages successfully", data: items, pagination: paginationData });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching storage packages', error });
    }
  });

const getPackageById = catchAsync(async (req: Request, res: Response) => {
    try {
      const packageId = req.params.id;
      const storagePackage = await StoragePackage.findById(packageId);
      
      if (!storagePackage) {
        res.status(404).json({ message: 'Storage package not found' });
        return;
      }
      
      res.status(200).json(storagePackage);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching storage package', error });
    }
  });

const create = catchAsync(async (req: Request, res: Response) => {
    try {
      console.log("Creating storage package with data:", req.body);
      const newPackageData: IStoragePackage = req.body;
      const newPackage = new StoragePackage(newPackageData);
      await newPackage.save();
      res.status(201).json(newPackage);
    } catch (error) {
      res.status(500).json({ message: 'Error creating storage package', error });
    }
  });

const update = catchAsync(async (req: Request, res: Response) => {

    try {
      const packageId = req.params.id;
      const updateData: Partial<IStoragePackage> = req.body;
      
      const updatedPackage = await StoragePackage.findByIdAndUpdate(
        packageId,
        updateData,
        { new: true }
      );
      
      if (!updatedPackage) {
        res.status(404).json({ message: 'Storage package not found' });
        return;
      }
      
      res.status(200).json(updatedPackage);
    } catch (error) {
      res.status(500).json({ message: 'Error updating storage package', error });
    }
  });

const deactivatePackage = catchAsync(async (req: Request, res: Response) => {
    try {
      // toggle is_active status
      const packageId = req.params.id;
      const storagePackage = await StoragePackage.findById(packageId);
      if (!storagePackage) {
        res.status(404).json({ message: 'Storage package not found' });
        return;
      }
      storagePackage.is_active = !storagePackage.is_active;
      await storagePackage.save();
      res.status(200).json({ message: `Package ${storagePackage.is_active ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
      res.status(500).json({ message: 'Error deactivating storage package', error });
    }
  });

export const Controller = {
  getAllPackages,
  getPackageById,
  create,
  update,
  deactivatePackage
};