import chalk from 'chalk';

/**
 * Logger Utility Class
 * 
 * Provides consistent, colored logging throughout the application.
 * Static methods for easy access without instantiation.
 * 
 * Design Decision:
 * - Static class (no instances needed)
 * - Colored output using Chalk for better UX
 * - Different log levels for different message types
 * - Support for structured logging (objects)
 * 
 * Usage:
 *   Logger.info('Starting process...');
 *   Logger.success('Task completed!');
 *   Logger.error('Something went wrong');
 */
export class Logger {
  /**
   * Informational messages (blue)
   * Use for general information and progress updates
   */
  public static info(message: string, data?: unknown): void {
    console.log(chalk.blue('ℹ'), chalk.white(message));
    if (data !== undefined) {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }
  }

  /**
   * Success messages (green)
   * Use when operations complete successfully
   */
  public static success(message: string, data?: unknown): void {
    console.log(chalk.green('✔'), chalk.green(message));
    if (data !== undefined) {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }
  }

  /**
   * Warning messages (yellow)
   * Use for non-critical issues that should be noted
   */
  public static warning(message: string, data?: unknown): void {
    console.log(chalk.yellow('⚠'), chalk.yellow(message));
    if (data !== undefined) {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }
  }

  /**
   * Error messages (red)
   * Use when operations fail or errors occur
   */
  public static error(message: string, error?: Error | unknown): void {
    console.log(chalk.red('✖'), chalk.red(message));
    
    if (error) {
      if (error instanceof Error) {
        console.log(chalk.red(`  ${error.name}: ${error.message}`));
        if (process.env.NODE_ENV === 'development' && error.stack) {
          console.log(chalk.gray(error.stack));
        }
      } else {
        console.log(chalk.gray(JSON.stringify(error, null, 2)));
      }
    }
  }

  /**
   * Debug messages (cyan)
   * Only shown in development mode
   */
  public static debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.cyan('🐛'), chalk.cyan(message));
      if (data !== undefined) {
        console.log(chalk.gray(JSON.stringify(data, null, 2)));
      }
    }
  }

  /**
   * Log a blank line for spacing
   */
  public static newLine(): void {
    console.log();
  }

  /**
   * Print a divider line
   */
  public static divider(char: string = '─', length: number = 50): void {
    console.log(chalk.gray(char.repeat(length)));
  }

  /**
   * Print a header with title
   */
  public static header(title: string): void {
    this.newLine();
    this.divider('═');
    console.log(chalk.bold.white(`  ${title}`));
    this.divider('═');
    this.newLine();
  }

  /**
   * Print a step message (for multi-step processes)
   */
  public static step(step: number, total: number, message: string): void {
    console.log(
      chalk.cyan(`[${step}/${total}]`),
      chalk.white(message)
    );
  }

  /**
   * Print a table-like structure
   */
  public static table(data: Record<string, string | number>): void {
    const maxKeyLength = Math.max(
      ...Object.keys(data).map(key => key.length)
    );

    Object.entries(data).forEach(([key, value]) => {
      const paddedKey = key.padEnd(maxKeyLength + 2);
      console.log(
        chalk.gray(paddedKey + ':'),
        chalk.white(value)
      );
    });
  }

  /**
   * Print a loading spinner message (for long operations)
   * Note: For actual spinners, consider using libraries like ora
   */
  public static loading(message: string): void {
    console.log(chalk.yellow('⏳'), chalk.white(message));
  }
}
