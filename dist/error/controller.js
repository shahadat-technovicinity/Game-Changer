"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const appError_1 = require("../utils/appError");
/**
 * Sends detailed error information during development.
 *
 * @param err - The error object to be sent.
 * @param res - The Express response object.
 */
const sendErrForDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
        stack: err.stack,
        success: false,
    });
};
/**
 * Sends limited error information in production.
 *
 * For operational (trusted) errors, the error message is sent to the client.
 * For programming or unknown errors, only a generic message is provided.
 *
 * @param err - The error object to be sent.
 * @param res - The Express response object.
 */
const sendErrProduction = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            success: false,
        });
    }
    else {
        // Log error details for debugging
        //console.log("Error", err);
        res.status(err.statusCode).json({
            status: "error",
            message: "Qualcosa è andato storto",
        });
    }
};
/**
 * Handles errors for invalid MongoDB ObjectIDs.
 *
 * @param err - The original error thrown due to an invalid ObjectID.
 * @returns A new AppError with a descriptive message and status code 400.
 */
const handleCastErrorDB = (err) => {
    const message = `Non valido ${err.path}: ${err.value}`;
    return new appError_1.AppError(message, 400);
};
/**
 * Handles duplicate field errors from MongoDB.
 *
 * @param err - The original error thrown due to duplicate field values.
 * @returns A new AppError with a descriptive message and status code 422.
 */
const handleDuplicateFieldsDB = (err) => {
    // Extract the duplicate value using regex from the error message
    const duplicateValueMatch = err.errmsg?.match(/(["'])(\\?.)*?\1/);
    const duplicateValue = duplicateValueMatch ? duplicateValueMatch[0] : "";
    const message = `Valore del campo duplicato ${duplicateValue}`;
    return new appError_1.AppError(message, 422);
};
/**
 * Handles general Mongoose errors that do not fall into other specific categories.
 *
 * @param err - The original Mongoose error.
 * @returns A new AppError with a descriptive message and status code 400.
 */
const handleMongooseError = (err) => {
    const message = `Mongoose error: ${err.message}`;
    return new appError_1.AppError(message, 400);
};
/**
 * Handles errors caused by invalid JSON Web Tokens.
 *
 * @returns A new AppError with a descriptive message and status code 401.
 */
const handleJWTError = () => {
    return new appError_1.AppError("Token non valido. Effettuare nuovamente il login!", 401);
};
/**
 * Handles errors caused by expired JSON Web Tokens.
 *
 * @returns A new AppError with a descriptive message and status code 401.
 */
const handleJwtTokenExpire = () => {
    return new appError_1.AppError("Token scaduto. Effettuare nuovamente il login", 401);
};
/**
 * Handles Mongoose validation errors.
 *
 * @param err - The original Mongoose validation error.
 * @returns A new AppError with a combined message of all validation errors and status code 400.
 */
const handleValidationError = (err) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = Object.values(err.errors).map((error) => error.message);
    const message = `Dati di input non validi. ${errors.join(". ")}`;
    return new appError_1.AppError(message, 400);
};
/**
 * Global error handling middleware for Express.
 *
 * This middleware captures errors thrown during route handling,
 * assigns default error properties if missing, and sends an appropriate
 * response based on the application's environment (development or production).
 *
 * @param err - The error object caught by Express.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param _next - The next middleware function (not used here).
 */
const globalErrorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "development") {
        //console.log(err);
        sendErrForDev(err, res);
    }
    else {
        // Clone the error object to avoid unwanted mutations
        let error = { ...err };
        error.message = err.message;
        if (err.name === "CastError")
            error = handleCastErrorDB(error);
        if (err.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (err.name === "ValidationError")
            error = handleValidationError(error);
        // Note: The following duplicate check was removed as it's redundant:
        // if (err.name === "ValidationError") error = handleValidationError(error);
        if (err.name === "JsonWebTokenError")
            error = handleJWTError();
        if (err.name === "TokenExpiredError")
            error = handleJwtTokenExpire();
        if (err.name === "MongooseError")
            error = handleMongooseError(error);
        sendErrProduction(error, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
