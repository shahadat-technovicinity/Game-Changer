"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdditionalById = exports.getAdditionalById = exports.updateAdditionalById = exports.deleteAdditionalByType = exports.createAdditionalByType = exports.getAdditionalByType = void 0;
const services_1 = require("./services");
const appError_1 = require("../utils/appError");
const catchAsync_1 = require("../utils/catchAsync");
const getAdditionalByType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type } = req.params;
    // Validate type
    if (!["privacy_policy", "terms_conditions", "faq"].includes(type)) {
        throw new appError_1.AppError("Tipo non valido", 400);
    }
    const page = await (0, services_1.getAdditionalByTypeService)(type);
    res.json({ message: "Informazioni recuperate con successo", page });
});
exports.getAdditionalByType = getAdditionalByType;
const createAdditionalByType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type } = req.params;
    const { body } = req.body; // Expecting an array of objects [{title, content}, {title, content}]
    if (!Array.isArray(body) || body.length === 0) {
        throw new appError_1.AppError("Corpo non valido", 400);
    }
    const page = await (0, services_1.createAdditionalByTypeService)(type, body);
    res.json({ message: "Informazioni create con successo", page });
});
exports.createAdditionalByType = createAdditionalByType;
const deleteAdditionalByType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type } = req.params;
    if (!["privacy_policy", "terms_conditions", "faq"].includes(type)) {
        throw new appError_1.AppError("Tipo non valido", 400);
    }
    await (0, services_1.deleteAdditionalByTypeService)(type);
    res.json({ message: "Informazioni eliminate con successo" });
});
exports.deleteAdditionalByType = deleteAdditionalByType;
const updateAdditionalById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type, id } = req.params;
    const { title, content } = req.body;
    // Validate type
    if (!["privacy_policy", "terms_conditions", "faq"].includes(type)) {
        throw new appError_1.AppError("Tipo non valido", 400);
    }
    // Validate id
    if (!id) {
        throw new appError_1.AppError("Id non valido", 400);
    }
    if (!title || !content) {
        throw new appError_1.AppError("Titolo o contenuto non valido", 400);
    }
    const page = await (0, services_1.updateAdditionalByIdService)(type, id, title, content);
    res.json({ message: "Informazioni aggiornate con successo", page });
});
exports.updateAdditionalById = updateAdditionalById;
const getAdditionalById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type, id } = req.params;
    // Validate type
    if (!["privacy_policy", "terms_conditions", "faq"].includes(type)) {
        throw new appError_1.AppError("Tipo non valido", 400);
    }
    // Validate id
    if (!id) {
        throw new appError_1.AppError("Id non valido", 400);
    }
    const page = await (0, services_1.getAdditionalByIdService)(type, id);
    res.json({ message: "Informazioni recuperate con successo", page });
});
exports.getAdditionalById = getAdditionalById;
const deleteAdditionalById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { type, id } = req.params;
    // Validate type
    if (!["privacy_policy", "terms_conditions", "faq"].includes(type)) {
        throw new appError_1.AppError("Tipo non valido", 400);
    }
    // Validate id
    if (!id) {
        throw new appError_1.AppError("Id non valido", 400);
    }
    await (0, services_1.deleteAdditionalByIdService)(type, id);
    res.json({ message: "Informazioni eliminate con successo" });
});
exports.deleteAdditionalById = deleteAdditionalById;
