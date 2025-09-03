import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


// Load environment variables with proper type safety

const {
  JWT_SECRET,
  JWT_EXPIRES_IN = "1h",
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN = "7d",
} = process.env as {
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  JWT_REFRESH_SECRET?: string;
  JWT_REFRESH_EXPIRES_IN?: string;
};

// Ensure required environment variables are set
if (!JWT_SECRET)
  throw new Error("❌ JWT_SECRET is not set in environment variables!");
if (!JWT_REFRESH_SECRET)
  throw new Error("❌ JWT_REFRESH_SECRET is not set in environment variables!");

// Token generation function (Reusable)
const generateToken = (
  data: object,
  secret: Secret,
  expiresIn: string | number
): string => {
  return jwt.sign(data, secret, { expiresIn: "30d" }); // Explicitly convert to string
};

// Generate Access Token
const generateAccessToken = (data: object): string =>
  generateToken(data, JWT_SECRET as Secret, JWT_EXPIRES_IN);

// Generate Refresh Token
const generateRefreshToken = (data: object): string =>
  generateToken(data, JWT_REFRESH_SECRET as Secret, JWT_REFRESH_EXPIRES_IN);

// Token Verification Function
const verifyToken = (
  token: string,
  secret: Secret
): JwtPayload | string | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload | string;
  } catch (error) {
    console.error("❌ Invalid Token:", error);
    return null;
  }
};

// Exporting functions for use across the project
export { generateAccessToken, generateRefreshToken, verifyToken };
