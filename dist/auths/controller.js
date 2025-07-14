"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ejs_1 = __importDefault(require("ejs"));
const model_1 = require("../users/model");
const appError_1 = require("../utils/appError");
const catchAsync_1 = require("../utils/catchAsync");
const token_1 = require("../utils/token");
const emailService_1 = require("../utils/emailService");
const model_2 = require("../teams/model");
const register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { first_name, last_name, email, password, team_code, role } = req.body;
    if (!first_name || !email || !password || !last_name) {
        throw new appError_1.AppError('Required fields are missing', 400);
    }
    const existingUser = await model_1.User.findOne({ email });
    if (existingUser) {
        throw new appError_1.AppError('Email already in use', 400);
    }
    let existingTeam;
    if (team_code) {
        existingTeam = await model_2.Team.findOne({ team_code });
        if (!existingTeam) {
            throw new appError_1.AppError('Team not found', 401);
        }
    }
    const user = await model_1.User.create({
        first_name,
        last_name,
        email,
        password,
        role
    });
    if (existingTeam && user) {
        // Cast _id to Types.ObjectId to avoid type error
        user.team_id = existingTeam._id;
        await user.save(); // Ensure save is awaited
        if (Array.isArray(existingTeam.players_id)) {
            existingTeam.players_id.push(user._id);
        }
        else {
            existingTeam.players_id = [user._id];
        }
        await existingTeam.save();
    }
    res.status(201).json({
        success: true,
        message: 'Registration successfully completed',
        data: user,
    });
    // TODO: Send Email
    let emailTemplatePath, subject;
    emailTemplatePath = path_1.default.resolve(__dirname, "..", // from auths to src
    "email_templates", "welcome_email.ejs");
    subject = "Welcome to Game Changer!";
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, "utf-8");
    const mailContent = ejs_1.default.render(emailTemplate, {
        name: `${user.first_name} ${user.last_name}`,
    });
    console.log("SUbject: ", subject);
    (0, emailService_1.sendEmail)(user.email, subject, mailContent);
});
const login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new appError_1.AppError('Email or password missing', 400);
    }
    const user = await model_1.User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new appError_1.AppError('Invalid credentials', 401);
    }
    if (user.is_deleted) {
        throw new appError_1.AppError('Your account has been deleted. Please contact admin for any assistance.', 400);
    }
    const accessToken = (0, token_1.generateAccessToken)({ id: user._id });
    const refreshToken = (0, token_1.generateRefreshToken)({ id: user._id });
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    await user.save();
    const options = {
        httpOnly: false,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        secure: true,
        maxAge: Number(process.env.COOKIES_EXPIRY_REMEMBER) || 600000,
    };
    res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json({
        success: true,
        message: 'Login successful',
        data: { user, accessToken, refreshToken },
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    res.clearCookie('accessToken').clearCookie('refreshToken').json({
        success: true,
        message: 'Logout successful',
    });
});
const updatePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
        throw new appError_1.AppError('Passwords do not match or are missing', 400);
    }
    const user = await model_1.User.findById(req.user.id).select('+password');
    if (!user)
        throw new appError_1.AppError('User not found', 404);
    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'Password updated successfully',
    });
});
const refreshAccessToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new appError_1.AppError('Missing refresh token', 401);
    }
    const decoded = (0, token_1.verifyToken)(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await model_1.User.findById(decoded.id);
    if (!user) {
        throw new appError_1.AppError('User not found', 404);
    }
    const accessToken = (0, token_1.generateAccessToken)({ id: user._id });
    res.status(200).json({
        success: true,
        message: 'Access token refreshed successfully',
        data: { user, accessToken, refreshToken },
    });
});
const forgetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    const user = await model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.AppError('User not found', 404);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.forget_password_code = otp;
    user.forget_password_code_time = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: 'OTP sent to your email',
    });
    // TODO: Send Email
    let emailTemplatePath, subject = "Ali";
    emailTemplatePath = path_1.default.resolve(__dirname, "..", // from auths to src
    "email_templates", "otp_email.ejs");
    subject = "Game Changer - Password Reset OTP";
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, "utf-8");
    const mailContent = ejs_1.default.render(emailTemplate, {
        name: `${user.first_name} ${user.last_name}`,
        code: otp,
    });
    (0, emailService_1.sendEmail)(user.email, subject, mailContent);
});
const otpVerify = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { otp, email } = req.body;
    const user = await model_1.User.findOne({
        email,
        forget_password_code: otp,
        forget_password_code_time: { $gt: new Date() },
    });
    if (!user) {
        throw new appError_1.AppError('Invalid or expired OTP', 401);
    }
    res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
    });
});
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { otp, password, confirmPassword, email } = req.body;
    if (!otp || !password || !confirmPassword || password !== confirmPassword) {
        throw new appError_1.AppError('Invalid input or passwords do not match', 400);
    }
    const user = await model_1.User.findOne({
        email,
        forget_password_code: otp,
        forget_password_code_time: { $gt: new Date() },
    });
    if (!user) {
        throw new appError_1.AppError('Invalid or expired OTP', 401);
    }
    user.password = password;
    user.forget_password_code = undefined;
    user.forget_password_code_time = undefined;
    await user.save();
    const accessToken = (0, token_1.generateAccessToken)({ id: user._id });
    res.status(200).json({
        success: true,
        message: 'Password reset successful',
        data: { user, accessToken },
    });
});
const deviceTokenUpdate = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { fcmToken } = req.body;
    await model_1.User.findByIdAndUpdate(req.user.id, {
        device_token: fcmToken,
    });
    res.status(200).json({
        success: true,
        message: 'Device token updated successfully',
    });
});
exports.Controller = {
    register,
    login,
    logout,
    updatePassword,
    refreshAccessToken,
    forgetPassword,
    otpVerify,
    resetPassword,
    deviceTokenUpdate,
};
