"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Additional = void 0;
const mongoose_1 = require("mongoose");
const PageSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        enum: ["privacy_policy", "terms_conditions", "faq"], // Allowed types
        unique: true, // Ensures only one of each type exists
    },
    body: [
        {
            title: { type: String, required: true },
            content: { type: String, required: true },
        },
    ],
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
const Additional = (0, mongoose_1.model)("Additional", PageSchema);
exports.Additional = Additional;
