import fs from 'fs';
import path from 'path';
import { Logger } from './Logger';

/**
 * Output Formatter Utility
 * 
 * Handles formatting and output of command results.
 * Supports multiple output formats and file saving.
 * 
 * Design Pattern: Strategy Pattern
 * - Different formatting strategies (text, JSON)
 * - File saving capability
 * - Consistent interface across all commands
 * 
 * Features:
 * - Text output (default, colored via Logger)
 * - JSON output (--json flag)
 * - File saving (--save flag)
 * - Automatic format detection
 * 
 * Usage:
 * ```typescript
 * const formatter = new OutputFormatter(options);
 * formatter.output(data, 'User data retrieved');
 * ```
 */

/**
 * Output options interface
 */
export interface OutputOptions {
  json?: boolean;      // Output as JSON
  save?: string;       // Save to file
  verbose?: boolean;   // Verbose mode
  [key: string]: unknown;
}

/**
 * OutputFormatter Class
 * 
 * Handles all command output formatting and saving.
 */
export class OutputFormatter {
  private options: OutputOptions;

  constructor(options: OutputOptions = {}) {
    this.options = options;
  }

  /**
   * Format and output data based on options
   * 
   * @param data - Data to output (can be object, string, number, etc.)
   * @param successMessage - Optional success message to display
   */
  public output(data: unknown, successMessage?: string): void {
    // Determine output format
    if (this.options.json) {
      this.outputJson(data);
    } else {
      this.outputText(data);
    }

    // Save to file if requested
    if (this.options.save) {
      this.saveToFile(data);
    }

    // Show success message if in text mode and message provided
    if (!this.options.json && successMessage) {
      Logger.success(successMessage);
    }
  }

  /**
   * Output data in JSON format
   * 
   * @param data - Data to output as JSON
   */
  private outputJson(data: unknown): void {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      console.log(jsonString);
    } catch (error) {
      Logger.error('Failed to serialize data to JSON', error);
      process.exit(1);
    }
  }

  /**
   * Output data in formatted text (using Logger)
   * This is the default output format
   * 
   * @param data - Data to output
   */
  private outputText(data: unknown): void {
    // If data is already formatted (string), just log it
    if (typeof data === 'string') {
      console.log(data);
      return;
    }

    // If data is an object, format it nicely
    if (typeof data === 'object' && data !== null) {
      // Commands should handle their own formatting
      // This is a fallback for objects
      Logger.info('Result:', data);
    } else {
      // For primitive types
      console.log(data);
    }
  }

  /**
   * Save data to a file
   * 
   * @param data - Data to save
   */
  private saveToFile(data: unknown): void {
    const filename = this.options.save!;
    
    try {
      // Convert data to string
      let content: string;
      
      if (typeof data === 'string') {
        content = data;
      } else if (typeof data === 'object') {
        // Save as JSON for objects
        content = JSON.stringify(data, null, 2);
      } else {
        content = String(data);
      }

      // Resolve file path
      const filePath = path.resolve(process.cwd(), filename);
      
      // Write to file
      fs.writeFileSync(filePath, content, 'utf-8');
      
      Logger.success(`Output saved to: ${filePath}`);
    } catch (error) {
      Logger.error(`Failed to save output to file: ${filename}`, error);
      process.exit(1);
    }
  }

  /**
   * Static helper to format data based on options
   * Provides a simpler API when you don't need an instance
   * 
   * @param data - Data to output
   * @param options - Output options
   * @param successMessage - Optional success message
   */
  public static format(
    data: unknown,
    options: OutputOptions = {},
    successMessage?: string
  ): void {
    const formatter = new OutputFormatter(options);
    formatter.output(data, successMessage);
  }

  /**
   * Check if JSON output mode is enabled
   */
  public isJsonMode(): boolean {
    return this.options.json || false;
  }

  /**
   * Check if file saving is enabled
   */
  public isSaveMode(): boolean {
    return !!this.options.save;
  }

  /**
   * Check if verbose mode is enabled
   */
  public isVerbose(): boolean {
    return this.options.verbose || false;
  }
}
