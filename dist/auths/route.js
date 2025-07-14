"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post("/register", controller_1.Controller.register);
router.post("/login", controller_1.Controller.login);
router.get("/logout", controller_1.Controller.logout);
router.post("/update-password", auth_1.protect, controller_1.Controller.updatePassword);
router.post("/forget-password", controller_1.Controller.forgetPassword);
router.post("/reset-password/verify", controller_1.Controller.otpVerify);
router.post("/reset-password", controller_1.Controller.resetPassword);
router.post("/update-deviceToken", auth_1.protect, controller_1.Controller.deviceTokenUpdate);
// refresh token
router.post("/refresh-token", controller_1.Controller.refreshAccessToken);
