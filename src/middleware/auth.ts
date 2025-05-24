import { verifyToken } from "../utils/token";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { User } from "../users/model";
import { JwtPayload } from "jsonwebtoken";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: typeof User.prototype;
    }
  }
}

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;
   

    // 1) Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2) Otherwise, check for token in cookies
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    // 3) If no token was found
    if (!token) {
      return next(new AppError("Token not found", 401));
    }

    // 4) Verify token
    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error) {
      return next(
        new AppError("Invalid or expired token. Please log in again.", 401)
      );
    }

    // 5) Check for user ID in token payload
    if (!decoded.id) {
      return next(new AppError("Token payload is missing user ID.", 401));
    }

    // 6) Find the user
    const user = await User.findById({ _id: decoded.id });
    if (!user) {
      return next(
        new AppError("The user belonging to this token no longer exists or is inactive.", 401)
      );
    }

    // 7) Attach user to request
    req.user = user;
    console.log("Admin: ", user);
    next();
  }
);

const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user!.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};

export { protect, restrictTo };
