"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/**
 * Represents an application-specific error.
 *
 * @remarks
 * This class extends the built-in `Error` object by adding additional properties
 * and functionality such as HTTP status code, success flag, and a list of related errors.
 */
class AppError extends Error {
    /**
     * Creates an instance of `AppError`.
     *
     * @param statusCode - The HTTP status code.
     * @param message - A descriptive error message. Defaults to `"Something went wrong"`.
     * @param errors - Additional error details. Defaults to an empty array.
     * @param stack - The stack trace for the error. If omitted, it will be captured automatically.
     */
    constructor(message = "Something went wrong", statusCode, errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.data = null;
        this.isOperational = true;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.AppError = AppError;
