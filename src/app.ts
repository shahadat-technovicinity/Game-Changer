import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import compression from "compression";

import { AppError } from "./utils/appError";
import { xssSanitizer } from "./utils/xss";
import { globalErrorHandler } from "./error/controller";
import { routes } from "./routes";

// Load environment variables
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));

// CORS - allow frontend access
app.use(cors({
  origin:[ process.env.CLIENT_URL as string,                 
  process.env.CLIENT_LOCALHOST_URL as string,                   
  process.env.ADMIN_PANEL_URL as string,                   
    '*'],
  credentials: true
}));

// Logging
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan("dev"));
}

// Security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api/v1", limiter);


// Cookie parser
app.use(cookieParser());

// NoSQL Injection protection
// app.use(mongoSanitize());

// XSS protection
app.use(xssSanitizer);

// Prevent HTTP Parameter Pollution
app.use(hpp({ whitelist: [] }));

// Compression
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}

// Routes
app.use("/api/v1", routes);

// Catch all undefined routes
const baseURL = process.env.BASE_URL || 'http://localhost';
app.use((req, res, next) => {
  try {
    // This will throw if any routes are invalid
    req.url && new URL(req.url, baseURL);
    next();
  } catch (err) {
    console.error('Invalid route path detected:', req.path);
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  }
});

// Global error handler
app.use(globalErrorHandler);

export { app };

