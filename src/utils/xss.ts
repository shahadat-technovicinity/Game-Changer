import { Request, Response, NextFunction } from "express";
import xssFilters from "xss-filters";

/**
 * Recursively sanitize an object by encoding its string values.
 * @param obj - The object to sanitize
 * @returns A sanitized object
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitizeObject = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "string") {
      obj[key] = xssFilters.inHTMLData(obj[key]); // Sanitize string input
    } else if (typeof obj[key] === "object") {
      obj[key] = sanitizeObject(obj[key]); // Recursively sanitize nested objects
    }
  });

  return obj;
};

/**
 * Express middleware to sanitize incoming request data.
 */
const xssSanitizer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.body = sanitizeObject(req.body);
  sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  next();
};

export { xssSanitizer };
