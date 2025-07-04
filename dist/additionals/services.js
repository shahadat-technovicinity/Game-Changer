"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalByIdService = exports.deleteAdditionalByIdService = exports.updateAdditionalByIdService = exports.deleteAdditionalByTypeService = exports.createAdditionalByTypeService = exports.getAdditionalByTypeService = void 0;
const model_1 = require("./model");
const appError_1 = require("../utils/appError");
// Fetch Page by Type (Privacy Policy, Terms & Conditions, FAQ)
const getAdditionalByTypeService = async (type) => {
    const page = await model_1.Additional.findOne({ type });
    if (!page) {
        throw new appError_1.AppError("Pagina non trovata", 404);
    }
    return page;
};
exports.getAdditionalByTypeService = getAdditionalByTypeService;
// Create or Update Page Content with multiple objects in body
const createAdditionalByTypeService = async (type, body) => {
    const page = await model_1.Additional.findOne({ type });
    if (!page) {
        // Create new page
        return await model_1.Additional.create({ type, body });
    }
    // Update existing page
    page.body = body;
    await page.save();
    return page;
};
exports.createAdditionalByTypeService = createAdditionalByTypeService;
// Delete Page by Type
const deleteAdditionalByTypeService = async (type) => {
    const page = await model_1.Additional.findOne({ type });
    if (!page) {
        throw new appError_1.AppError("Pagina non trovata", 404);
    }
    await model_1.Additional.deleteOne({ type });
    return;
};
exports.deleteAdditionalByTypeService = deleteAdditionalByTypeService;
const updateAdditionalByIdService = async (type, id, title, content) => {
    const page = await model_1.Additional.findOneAndUpdate({ type, "body._id": id }, // Find the document with matching type and nested _id
    {
        $set: {
            "body.$.title": title,
            "body.$.content": content
        }
    }, { new: true } // Return updated document
    );
    if (!page) {
        throw new appError_1.AppError("Pagina non trovata", 404);
    }
    await page.save();
    return page;
};
exports.updateAdditionalByIdService = updateAdditionalByIdService;
// Delete Page by FAQ Type and inside seperate object
const deleteAdditionalByIdService = async (type, id) => {
    const page = await model_1.Additional.findOne({ type, "body._id": id });
    if (!page) {
        throw new appError_1.AppError("Pagina non trovata", 404);
    }
    await model_1.Additional.findOneAndUpdate({ type }, { $pull: { body: { _id: id } } }, // Remove the specific FAQ entry by _id
    { new: true } // Return the updated document
    );
    return;
};
exports.deleteAdditionalByIdService = deleteAdditionalByIdService;
// Get Page by FAQ Type and inside seperate object
const getAdditionalByIdService = async (type, id) => {
    const page = await model_1.Additional.findOne({ type, "body._id": id }, { "body.$": 1 } // This will return only the matched object inside `body`
    );
    if (!page) {
        throw new appError_1.AppError("Voce FAQ non trovata", 404);
    }
    return page; // Return only the specific FAQ object
};
exports.getAdditionalByIdService = getAdditionalByIdService;
