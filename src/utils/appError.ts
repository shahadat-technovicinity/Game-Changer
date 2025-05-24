/**
 * Interface representing the structure of an application-specific error.
 */
interface IAppError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  statusCode: number;

  /**
   * Indicates whether the request was successful or not.
   * Defaults to `false` for errors.
   */
  success: boolean;

  /**
   * A user-friendly message that describes the error.
   */
  message: string;

  /**
   * Additional error details that may be relevant to the consumer of the error.
   */
  errors: unknown[];

  /**
   * Any associated data you want to send with the error (optional).
   */
  data: unknown;

  /**
   * add isOperational property to the error object
   */
  isOperational?: boolean;
  path?: string;
  value?: string;
  errmsg?: string;
  code?: number;
}

/**
 * Represents an application-specific error.
 *
 * @remarks
 * This class extends the built-in `Error` object by adding additional properties
 * and functionality such as HTTP status code, success flag, and a list of related errors.
 */
class AppError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  public statusCode: number;

  /**
   * Indicates whether the request was successful or not.
   * Defaults to `false` for AppError instances.
   */
  public success: boolean;

  /**
   * A user-friendly message that describes the error.
   */
  public override message: string;

  /**
   * Additional error details that may be relevant to the consumer of the error.
   */
  public errors: unknown[];

  /**
   * Any associated data you want to send with the error (optional).
   */
  public data: unknown;

  /**
   * Indicates whether the error is operational or not.
   * Defaults to `true` for AppError instances.
   */
  public isOperational: boolean;

  /**
   * Creates an instance of `AppError`.
   *
   * @param statusCode - The HTTP status code.
   * @param message - A descriptive error message. Defaults to `"Something went wrong"`.
   * @param errors - Additional error details. Defaults to an empty array.
   * @param stack - The stack trace for the error. If omitted, it will be captured automatically.
   */
  constructor(
    message: string = "Something went wrong",
    statusCode: number,
    errors: unknown[] = [],
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.data = null;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { AppError, IAppError };
