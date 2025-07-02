import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../users/model';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../utils/token';
import { sendEmail } from '../utils/emailService';
import { Team } from '../teams/model';

const register = catchAsync(async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, team_code , role } = req.body;

  if (!first_name || !email || !password || !last_name || role) {
    throw new AppError('Required fields are missing', 400);
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }
  let existingTeam;
  if (team_code) {
    existingTeam = await Team.findOne({ team_code });
    if (!existingTeam) {
      throw new AppError('Team not found', 400);
    }
  }

  const user = await User.create({
    first_name,
    last_name,
    email,
    password,
    role
  });
  if(existingTeam && user){
    // Cast _id to Types.ObjectId to avoid type error
    user.team_id = existingTeam._id as import('mongoose').Types.ObjectId;
    await user.save(); // Ensure save is awaited
  }
  res.status(201).json({
    success: true,
    message: 'Registration successfully completed',
    data: user,
  });

  // TODO: Send Email
  let emailTemplatePath, subject;
  emailTemplatePath = path.resolve(
    __dirname,
    "..", // from auths to src
    "email_templates",
    "welcome_email.ejs"
  );
  subject = "Welcome to Game Changer!";

  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  const mailContent = ejs.render(emailTemplate, {
    name: `${user.first_name} ${user.last_name}`,
  });
  console.log("SUbject: ", subject);
  sendEmail(user.email, subject, mailContent);

});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email or password missing', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.access_token = accessToken;
  user.refresh_token = refreshToken;
  await user.save();

  const options = {
    httpOnly: false,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'none' as const,
    secure: true,
    maxAge: Number(process.env.COOKIES_EXPIRY_REMEMBER!) || 600000,
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

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('accessToken').clearCookie('refreshToken').json({
    success: true,
    message: 'Logout successful',
  });
});

const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
    throw new AppError('Passwords do not match or are missing', 400);
  }

  const user = await User.findById(req.user!.id).select('+password');
  if (!user) throw new AppError('User not found', 404);

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Missing refresh token', 401);
  }

  const decoded = verifyToken(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!
  ) as JwtPayload;

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User not found', 401);
  }

  const accessToken = generateAccessToken({ id: user._id });
  res.status(200).json({
    success: true,
    message: 'Access token refreshed successfully',
    data: { user, accessToken, refreshToken },
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 401);
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
  emailTemplatePath = path.resolve(
    __dirname,
    "..", // from auths to src
    "email_templates",
    "otp_email.ejs"
  );
  subject = "Game Changer - Password Reset OTP";
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  const mailContent = ejs.render(emailTemplate, {
    name: `${user.first_name} ${user.last_name}`,
    code: otp,
  });
  sendEmail(user.email, subject, mailContent);

});

const otpVerify = catchAsync(async (req: Request, res: Response) => {
  const { otp, email } = req.body;
  const user = await User.findOne({
    email,
    forget_password_code: otp,
    forget_password_code_time: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError('Invalid or expired OTP', 401);
  }

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { otp, password, confirmPassword, email } = req.body;

  if (!otp || !password || !confirmPassword || password !== confirmPassword) {
    throw new AppError('Invalid input or passwords do not match', 400);
  }
  const user = await User.findOne({
    email,
    forget_password_code: otp,
    forget_password_code_time: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError('Invalid or expired OTP', 401);
  }

  user.password = password;
  user.forget_password_code = undefined;
  user.forget_password_code_time = undefined;
  await user.save();

  const accessToken = generateAccessToken({ id: user._id });

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
    data: { user, accessToken },
  });
});

const deviceTokenUpdate = catchAsync(async (req: Request, res: Response) => {
  const { fcmToken } = req.body;

  await User.findByIdAndUpdate(req.user!.id, {
    device_token: fcmToken,
  });

  res.status(200).json({
    success: true,
    message: 'Device token updated successfully',
  });
});

export const Controller =  {
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
