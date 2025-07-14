"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Load environment variables with proper type safety
const { JWT_SECRET, JWT_EXPIRES_IN = "1h", JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN = "7d", } = process.env;
// Ensure required environment variables are set
if (!JWT_SECRET)
    throw new Error("❌ JWT_SECRET is not set in environment variables!");
if (!JWT_REFRESH_SECRET)
    throw new Error("❌ JWT_REFRESH_SECRET is not set in environment variables!");
// Token generation function (Reusable)
const generateToken = (data, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(data, secret, { expiresIn: "30d" }); // Explicitly convert to string
};
// Generate Access Token
const generateAccessToken = (data) => generateToken(data, JWT_SECRET, JWT_EXPIRES_IN);
exports.generateAccessToken = generateAccessToken;
// Generate Refresh Token
const generateRefreshToken = (data) => generateToken(data, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
exports.generateRefreshToken = generateRefreshToken;
// Token Verification Function
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        console.error("❌ Invalid Token:", error);
        return null;
    }
};
exports.verifyToken = verifyToken;
