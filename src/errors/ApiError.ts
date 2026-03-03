import { AppError } from './AppError';
import { AxiosError } from 'axios';

/**
 * API Error Class
 * 
 * Thrown when API requests fail.
 * Wraps Axios errors and provides consistent error handling.
 * 
 * Design Decision:
 * - Extends AppError for consistency
 * - Extracts useful information from Axios errors
 * - Provides context about the failed request
 */
export class ApiError extends AppError {
  public readonly url?: string;
  public readonly method?: string;
  public readonly responseData?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    url?: string,
    method?: string,
    responseData?: unknown
  ) {
    super(message, statusCode, true);
    
    this.url = url;
    this.method = method;
    this.responseData = responseData;
    
    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Override toJSON to include API-specific data
   */
  public toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      url: this.url,
      method: this.method,
      responseData: this.responseData,
    };
  }

  /**
   * Static factory method to create ApiError from AxiosError
   * Extracts relevant information from Axios error object
   */
  public static fromAxiosError(error: AxiosError): ApiError {
    const message = error.response?.data 
      ? (error.response.data as { message?: string }).message || error.message
      : error.message;
    
    const statusCode = error.response?.status || 500;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    const responseData = error.response?.data;

    return new ApiError(
      message,
      statusCode,
      url,
      method,
      responseData
    );
  }

  /**
   * Check if error is a network error (no response received)
   */
  public isNetworkError(): boolean {
    return !this.responseData;
  }

  /**
   * Check if error is a timeout error
   */
  public isTimeoutError(): boolean {
    return this.message.toLowerCase().includes('timeout');
  }
}
