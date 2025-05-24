"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const token_1 = require("../utils/token");
const appError_1 = require("../utils/appError");
const catchAsync_1 = require("../utils/catchAsync");
const model_1 = require("../users/model");
const protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    let token;
    // 1) Check for token in Authorization header
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    // 2) Otherwise, check for token in cookies
    else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    // 3) If no token was found
    if (!token) {
        return next(new appError_1.AppError("Token not found", 401));
    }
    // 4) Verify token
    let decoded;
    try {
        decoded = (0, token_1.verifyToken)(token, process.env.JWT_SECRET);
    }
    catch (error) {
        return next(new appError_1.AppError("Invalid or expired token. Please log in again.", 401));
    }
    // 5) Check for user ID in token payload
    if (!decoded.id) {
        return next(new appError_1.AppError("Token payload is missing user ID.", 401));
    }
    // 6) Find the user
    const user = await model_1.User.findById({ _id: decoded.id });
    if (!user) {
        return next(new appError_1.AppError("The user belonging to this token no longer exists or is inactive.", 401));
    }
    // 7) Attach user to request
    req.user = user;
    console.log("Admin: ", user);
    next();
});
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError_1.AppError("You do not have permission to perform this action.", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
