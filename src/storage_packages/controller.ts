import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { StoragePackage, IStoragePackage } from './model';

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
    try {
      const packages = await StoragePackage.find({ is_active: true });
      res.status(200).json(packages);
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
      const packageId = req.params.id;
      const updatedPackage = await StoragePackage.findByIdAndUpdate(
        packageId,
        { is_active: false },
        { new: true }
      );
      
      if (!updatedPackage) {
        res.status(404).json({ message: 'Storage package not found' });
        return;
      }
      
      res.status(200).json({ message: 'Package deactivated successfully' });
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