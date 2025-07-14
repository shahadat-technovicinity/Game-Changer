"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const model_1 = require("./model");
const queryHelper_1 = require("../utils/queryHelper");
const getAllPackages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    try {
        const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(req.query);
        const filter = { is_active: true, ...finalQuery };
        const [items, totalItems] = await Promise.all([
            model_1.StoragePackage.find(filter).sort(sortQuery).skip(skip).limit(limit),
            model_1.StoragePackage.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        const paginationData = {
            totalItems,
            totalPages,
            currentPage: page,
            limit,
        };
        res.status(200).json({ success: true, message: "Retrived all storage packages successfully", data: items, pagination: paginationData });
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
        console.log("Creating storage package with data:", req.body);
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
        // toggle is_active status
        const packageId = req.params.id;
        const storagePackage = await model_1.StoragePackage.findById(packageId);
        if (!storagePackage) {
            res.status(404).json({ message: 'Storage package not found' });
            return;
        }
        storagePackage.is_active = !storagePackage.is_active;
        await storagePackage.save();
        res.status(200).json({ message: `Package ${storagePackage.is_active ? 'activated' : 'deactivated'} successfully` });
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
