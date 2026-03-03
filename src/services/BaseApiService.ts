import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '@/errors';
import { Logger } from '@/utils';

/**
 * API Request Options
 * 
 * Extended options for API requests beyond standard Axios options
 */
export interface ApiRequestOptions extends AxiosRequestConfig {
  retries?: number;
  retryDelay?: number;
  logRequests?: boolean;
}

/**
 * Base API Service Abstract Class
 * 
 * Provides a foundation for all API service classes.
 * Handles common HTTP operations, error handling, and request configuration.
 * 
 * Design Decision:
 * - Abstract class to enforce consistent API interaction patterns
 * - Centralized error handling and transformation
 * - Built-in retry logic for failed requests
 * - Request/Response interceptors for common operations
 * - Type-safe generic responses
 * 
 * SOLID Principles:
 * - Single Responsibility: Handles only HTTP communication
 * - Dependency Inversion: Depends on abstractions (axios interface)
 * 
 * Benefits:
 * - DRY: No repetition of HTTP logic across services
 * - Consistent error handling across all API calls
 * - Easy to add authentication, logging, retry logic
 * - Type-safe API responses
 * 
 * Usage Example:
 * ```typescript
 * export class GithubApiService extends BaseApiService {
 *   constructor() {
 *     super('https://api.github.com');
 *     this.setDefaultHeaders({
 *       'Accept': 'application/vnd.github.v3+json'
 *     });
 *   }
 * 
 *   async getUser(username: string): Promise<GithubUser> {
 *     return this.get<GithubUser>(`/users/${username}`);
 *   }
 * }
 * ```
 */
export abstract class BaseApiService {
  protected readonly axios: AxiosInstance;
  protected readonly baseURL: string;

  /**
   * Constructor
   * 
   * @param baseURL - Base URL for all API requests
   * @param config - Optional Axios configuration
   */
  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.baseURL = baseURL;
    
    // Create axios instance with base configuration
    this.axios = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds default timeout
      ...config,
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   * Override this method in child classes to customize behavior
   */
  protected setupInterceptors(): void {
    // Request interceptor
    this.axios.interceptors.request.use(
      (config) => {
        // Log request in development mode
        if (process.env.NODE_ENV === 'development') {
          Logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        // Log response in development mode
        if (process.env.NODE_ENV === 'development') {
          Logger.debug(`API Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error: AxiosError) => {
        // Transform Axios error to custom ApiError
        const apiError = ApiError.fromAxiosError(error);
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Set default headers for all requests
   * 
   * @param headers - Headers to set
   */
  public setDefaultHeaders(headers: Record<string, string>): void {
    Object.entries(headers).forEach(([key, value]) => {
      this.axios.defaults.headers.common[key] = value;
    });
  }

  /**
   * Set authorization token
   * 
   * @param token - Bearer token
   */
  public setAuthToken(token: string): void {
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  public removeAuthToken(): void {
    delete this.axios.defaults.headers.common['Authorization'];
  }

  /**
   * Make a GET request
   * 
   * @param url - Endpoint URL
   * @param config - Optional request configuration
   * @returns Promise with response data
   */
  public async get<T = unknown>(
    url: string,
    config?: ApiRequestOptions
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  /**
   * Make a POST request
   * 
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param config - Optional request configuration
   * @returns Promise with response data
   */
  public async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestOptions
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  /**
   * Make a PUT request
   * 
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param config - Optional request configuration
   * @returns Promise with response data
   */
  public async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestOptions
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  /**
   * Make a PATCH request
   * 
   * @param url - Endpoint URL
   * @param data - Request body data
   * @param config - Optional request configuration
   * @returns Promise with response data
   */
  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestOptions
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  /**
   * Make a DELETE request
   * 
   * @param url - Endpoint URL
   * @param config - Optional request configuration
   * @returns Promise with response data
   */
  public async delete<T = unknown>(
    url: string,
    config?: ApiRequestOptions
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  /**
   * Handle API errors
   * Override this method in child classes for custom error handling
   * 
   * @param error - The API error
   * @returns Transformed error
   */
  protected handleError(error: ApiError): ApiError {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      Logger.error('API Error:', error);
    }

    // You can add custom error transformation logic here
    // For example: retry logic, specific error message formatting, etc.

    return error;
  }

  /**
   * Make a request with automatic retry on failure
   * 
   * @param requestFn - Function that makes the request
   * @param retries - Number of retry attempts
   * @param retryDelay - Delay between retries in ms
   * @returns Promise with response data
   */
  protected async withRetry<T>(
    requestFn: () => Promise<T>,
    retries: number = 3,
    retryDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.statusCode < 500) {
          throw error;
        }

        if (attempt < retries) {
          Logger.warning(`Request failed, retrying... (${attempt}/${retries})`);
          await this.delay(retryDelay * attempt); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  /**
   * Delay helper for retry logic
   * 
   * @param ms - Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get the base URL
   */
  public getBaseURL(): string {
    return this.baseURL;
  }
}
