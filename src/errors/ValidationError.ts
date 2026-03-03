import { AppError } from './AppError';

/**
 * Validation Error Class
 * 
 * Thrown when input validation fails.
 * Used by validators to indicate invalid user input.
 * 
 * Design Decision:
 * - Extends AppError for consistent error handling
 * - StatusCode 400 (Bad Request) by default
 * - Stores field-level validation errors
 */
export class ValidationError extends AppError {
  public readonly field?: string;
  public readonly validationErrors?: Record<string, string[]>;

  constructor(
    message: string,
    field?: string,
    validationErrors?: Record<string, string[]>
  ) {
    super(message, 400, true);
    
    this.field = field;
    this.validationErrors = validationErrors;
    
    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  /**
   * Override toJSON to include validation-specific data
   */
  public toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      field: this.field,
      validationErrors: this.validationErrors,
    };
  }

  /**
   * Static factory method for creating validation errors from multiple fields
   */
  public static fromFields(
    errors: Record<string, string[]>
  ): ValidationError {
    const errorCount = Object.keys(errors).length;
    const message = `Validation failed for ${errorCount} field(s)`;
    
    return new ValidationError(message, undefined, errors);
  }
}
