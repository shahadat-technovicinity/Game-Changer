"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xssSanitizer = void 0;
const xss_filters_1 = __importDefault(require("xss-filters"));
/**
 * Recursively sanitize an object by encoding its string values.
 * @param obj - The object to sanitize
 * @returns A sanitized object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== "object")
        return obj;
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "string") {
            obj[key] = xss_filters_1.default.inHTMLData(obj[key]); // Sanitize string input
        }
        else if (typeof obj[key] === "object") {
            obj[key] = sanitizeObject(obj[key]); // Recursively sanitize nested objects
        }
    });
    return obj;
};
/**
 * Express middleware to sanitize incoming request data.
 */
const xssSanitizer = (req, res, next) => {
    req.body = sanitizeObject(req.body);
    sanitizeObject(req.query);
    req.params = sanitizeObject(req.params);
    next();
};
exports.xssSanitizer = xssSanitizer;
