/**
 * Base Application Error Class
 * 
 * All custom errors in the application should extend this class.
 * Provides consistent error handling across the CLI.
 * 
 * Design Pattern: Error Hierarchy
 * - Enables type-safe error handling
 * - Allows catching specific error types
 * - Maintains stack traces
 */
export class AppError extends Error {
  public readonly name: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    
    // Maintains proper stack trace for where error was thrown (V8 engines only)
    Error.captureStackTrace(this, this.constructor);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Distinguishes operational errors from programming errors
    
    // Set the prototype explicitly to maintain instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Converts error to JSON format
   * Useful for logging and API responses
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      stack: this.stack,
    };
  }
}
