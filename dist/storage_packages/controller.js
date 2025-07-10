"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const model_1 = require("./model");
const getAllPackages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    try {
        const packages = await model_1.StoragePackage.find({ is_active: true });
        res.status(200).json(packages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching storage packages', error });
    }
});
const getPackageById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    try {
        const packageId = req.params.id;
        const storagePackage = await model_1.StoragePackage.findById(packageId);
        if (!storagePackage) {
            res.status(404).json({ message: 'Storage package not found' });
            return;
        }
        res.status(200).json(storagePackage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching storage package', error });
    }
});
const create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    try {
        const newPackageData = req.body;
        const newPackage = new model_1.StoragePackage(newPackageData);
        await newPackage.save();
        res.status(201).json(newPackage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating storage package', error });
    }
});
const update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    try {
        const packageId = req.params.id;
        const updateData = req.body;
        const updatedPackage = await model_1.StoragePackage.findByIdAndUpdate(packageId, updateData, { new: true });
        if (!updatedPackage) {
            res.status(404).json({ message: 'Storage package not found' });
            return;
        }
        res.status(200).json(updatedPackage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating storage package', error });
    }
});
const deactivatePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    try {
        const packageId = req.params.id;
        const updatedPackage = await model_1.StoragePackage.findByIdAndUpdate(packageId, { is_active: false }, { new: true });
        if (!updatedPackage) {
            res.status(404).json({ message: 'Storage package not found' });
            return;
        }
        res.status(200).json({ message: 'Package deactivated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deactivating storage package', error });
    }
});
exports.Controller = {
    getAllPackages,
    getPackageById,
    create,
    update,
    deactivatePackage
};
