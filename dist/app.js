"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = require("express-rate-limit");
const hpp_1 = __importDefault(require("hpp"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const appError_1 = require("./utils/appError");
const xss_1 = require("./utils/xss");
const controller_1 = require("./error/controller");
const routes_1 = require("./routes");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({ limit: "10kb" }));
// CORS - allow frontend access
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
// Logging
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)("dev"));
}
// Security HTTP headers
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    max: 10000,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api/v1", limiter);
// Cookie parser
app.use((0, cookie_parser_1.default)());
// NoSQL Injection protection
// app.use(mongoSanitize());
// XSS protection
app.use(xss_1.xssSanitizer);
// Prevent HTTP Parameter Pollution
app.use((0, hpp_1.default)({ whitelist: [] }));
// Compression
if (process.env.NODE_ENV === 'production') {
    app.use((0, compression_1.default)());
}
// Routes
app.use("/api/v1", routes_1.routes);
// Catch all undefined routes
const baseURL = process.env.BASE_URL || 'http://localhost';
app.use((req, res, next) => {
    try {
        // This will throw if any routes are invalid
        req.url && new URL(req.url, baseURL);
        next();
    }
    catch (err) {
        console.error('Invalid route path detected:', req.path);
        throw new appError_1.AppError(`Can't find ${req.originalUrl} on this server`, 404);
    }
});
// Global error handler
app.use(controller_1.globalErrorHandler);
