import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth";
import {Controller} from "./controller";
const router = Router();

router.post(
  "/register",
  Controller.register
);
router.post("/login",Controller.login);
router.get("/logout",Controller.logout);
router.post("/update-password", protect, Controller.updatePassword);
router.post("/forget-password", Controller.forgetPassword);
router.post("/reset-password/verify", Controller.otpVerify);
router.post("/reset-password", Controller.resetPassword);
router.post("/update-deviceToken",protect, Controller.deviceTokenUpdate);
// refresh token
router.post("/refresh-token", Controller.refreshAccessToken);



export { router as authRouter};
