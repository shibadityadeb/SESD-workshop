import { ValidationError } from '@/errors';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Validation Result Interface
 * 
 * Standardized return type for all validators
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator Class
 * 
 * Collection of static validation methods.
 * Each method returns a ValidationResult or throws ValidationError.
 * 
 * Design Decision:
 * - Static methods for easy use without instantiation
 * - Composable validators for complex validation logic
 * - Consistent error messages
 * - Type-safe validation
 * 
 * Usage:
 * ```typescript
 * const emailResult = Validator.validateEmail('test@example.com');
 * if (!emailResult.isValid) {
 *   throw new ValidationError(emailResult.error);
 * }
 * 
 * // Or use the throwing version
 * Validator.requireEmail('test@example.com'); // throws if invalid
 * ```
 */
export class Validator {
  /**
   * Validate email format
   * Uses RFC 5322 simplified regex
   * 
   * @param email - Email address to validate
   * @returns Validation result
   */
  public static validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || email.trim().length === 0) {
      return {
        isValid: false,
        error: 'Email is required',
      };
    }

    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: 'Invalid email format',
      };
    }

    return { isValid: true };
  }

  /**
   * Validate email and throw if invalid
   * 
   * @param email - Email address to validate
   * @param fieldName - Optional field name for error message
   * @throws ValidationError if email is invalid
   */
  public static requireEmail(email: string, fieldName: string = 'email'): void {
    const result = this.validateEmail(email);
    if (!result.isValid) {
      throw new ValidationError(result.error || 'Invalid email', fieldName);
    }
  }

  /**
   * Validate that a value is not empty
   * 
   * @param value - Value to check
   * @param fieldName - Field name for error message
   * @returns Validation result
   */
  public static validateRequired(value: unknown, fieldName: string): ValidationResult {
    if (value === null || value === undefined) {
      return {
        isValid: false,
        error: `${fieldName} is required`,
      };
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      return {
        isValid: false,
        error: `${fieldName} cannot be empty`,
      };
    }

    if (Array.isArray(value) && value.length === 0) {
      return {
        isValid: false,
        error: `${fieldName} cannot be an empty array`,
      };
    }

    return { isValid: true };
  }

  /**
   * Require a value to be present and throw if not
   * 
   * @param value - Value to check
   * @param fieldName - Field name for error message
   * @throws ValidationError if value is missing
   */
  public static require(value: unknown, fieldName: string): void {
    const result = this.validateRequired(value, fieldName);
    if (!result.isValid) {
      throw new ValidationError(result.error || `${fieldName} is required`, fieldName);
    }
  }

  /**
   * Validate that a file exists
   * 
   * @param filePath - Path to the file
   * @returns Validation result
   */
  public static validateFileExists(filePath: string): ValidationResult {
    if (!filePath || filePath.trim().length === 0) {
      return {
        isValid: false,
        error: 'File path is required',
      };
    }

    try {
      const resolvedPath = path.resolve(filePath);
      
      if (!fs.existsSync(resolvedPath)) {
        return {
          isValid: false,
          error: `File not found: ${filePath}`,
        };
      }

      const stats = fs.statSync(resolvedPath);
      if (!stats.isFile()) {
        return {
          isValid: false,
          error: `Path is not a file: ${filePath}`,
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: `Error checking file: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Require a file to exist and throw if not
   * 
   * @param filePath - Path to the file
   * @param fieldName - Optional field name for error message
   * @throws ValidationError if file doesn't exist
   */
  public static requireFile(filePath: string, fieldName: string = 'file'): void {
    const result = this.validateFileExists(filePath);
    if (!result.isValid) {
      throw new ValidationError(result.error || 'File not found', fieldName);
    }
  }

  /**
   * Validate that a directory exists
   * 
   * @param dirPath - Path to the directory
   * @returns Validation result
   */
  public static validateDirectoryExists(dirPath: string): ValidationResult {
    if (!dirPath || dirPath.trim().length === 0) {
      return {
        isValid: false,
        error: 'Directory path is required',
      };
    }

    try {
      const resolvedPath = path.resolve(dirPath);
      
      if (!fs.existsSync(resolvedPath)) {
        return {
          isValid: false,
          error: `Directory not found: ${dirPath}`,
        };
      }

      const stats = fs.statSync(resolvedPath);
      if (!stats.isDirectory()) {
        return {
          isValid: false,
          error: `Path is not a directory: ${dirPath}`,
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: `Error checking directory: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Require a directory to exist and throw if not
   * 
   * @param dirPath - Path to the directory
   * @param fieldName - Optional field name for error message
   * @throws ValidationError if directory doesn't exist
   */
  public static requireDirectory(dirPath: string, fieldName: string = 'directory'): void {
    const result = this.validateDirectoryExists(dirPath);
    if (!result.isValid) {
      throw new ValidationError(result.error || 'Directory not found', fieldName);
    }
  }

  /**
   * Validate string length
   * 
   * @param value - String to validate
   * @param min - Minimum length
   * @param max - Maximum length
   * @param fieldName - Field name for error message
   * @returns Validation result
   */
  public static validateLength(
    value: string,
    min: number,
    max: number,
    fieldName: string
  ): ValidationResult {
    if (!value) {
      return {
        isValid: false,
        error: `${fieldName} is required`,
      };
    }

    if (value.length < min) {
      return {
        isValid: false,
        error: `${fieldName} must be at least ${min} characters`,
      };
    }

    if (value.length > max) {
      return {
        isValid: false,
        error: `${fieldName} must be at most ${max} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate URL format
   * 
   * @param url - URL to validate
   * @returns Validation result
   */
  public static validateUrl(url: string): ValidationResult {
    if (!url || url.trim().length === 0) {
      return {
        isValid: false,
        error: 'URL is required',
      };
    }

    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: 'Invalid URL format',
      };
    }
  }

  /**
   * Require a valid URL and throw if not
   * 
   * @param url - URL to validate
   * @param fieldName - Optional field name for error message
   * @throws ValidationError if URL is invalid
   */
  public static requireUrl(url: string, fieldName: string = 'url'): void {
    const result = this.validateUrl(url);
    if (!result.isValid) {
      throw new ValidationError(result.error || 'Invalid URL', fieldName);
    }
  }

  /**
   * Validate that a value is one of allowed values
   * 
   * @param value - Value to check
   * @param allowedValues - Array of allowed values
   * @param fieldName - Field name for error message
   * @returns Validation result
   */
  public static validateEnum<T>(
    value: T,
    allowedValues: T[],
    fieldName: string
  ): ValidationResult {
    if (!allowedValues.includes(value)) {
      return {
        isValid: false,
        error: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
      };
    }

    return { isValid: true };
  }
}
