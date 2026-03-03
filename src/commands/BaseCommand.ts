import { Command } from 'commander';
import { Logger } from '@/utils';

/**
 * Command Options Interface
 * 
 * Defines the structure for command options passed to execute method.
 * Extend this interface in child classes for type-safe options.
 */
export interface CommandOptions {
  [key: string]: unknown;
}

/**
 * Base Command Abstract Class
 * 
 * All CLI commands must extend this class.
 * Enforces consistent structure and behavior across all commands.
 * 
 * Design Pattern: Template Method Pattern
 * - Defines the skeleton of command structure
 * - Forces implementation of key methods in child classes
 * - Provides common functionality (error handling, logging)
 * 
 * SOLID Principles:
 * - Single Responsibility: Each command handles one specific task
 * - Open/Closed: Open for extension (inheritance), closed for modification
 * - Liskov Substitution: All commands can be used interchangeably
 * 
 * Abstract members that MUST be implemented:
 * - name: Command name (e.g., 'init', 'deploy')
 * - description: What the command does
 * - execute(): The actual command logic
 * 
 * Usage Example:
 * ```typescript
 * export class InitCommand extends BaseCommand {
 *   public readonly name = 'init';
 *   public readonly description = 'Initialize a new project';
 * 
 *   public async execute(options: CommandOptions): Promise<void> {
 *     // Command implementation
 *   }
 * }
 * ```
 */
export abstract class BaseCommand {
  /**
   * Command name (must be unique)
   * Used as the CLI command: `devforge <name>`
   */
  public abstract readonly name: string;

  /**
   * Command description
   * Displayed in help text
   */
  public abstract readonly description: string;

  /**
   * Optional command alias
   * Short version of the command name
   */
  public readonly alias?: string;

  /**
   * Execute the command
   * This is where the main command logic goes
   * 
   * @param options - Command options passed from CLI
   * @returns Promise that resolves when command completes
   */
  public abstract execute(options: CommandOptions): Promise<void>;

  /**
   * Configure the command with Commander.js
   * Override this method to add custom options, arguments, etc.
   * 
   * @param command - Commander Command instance
   * @returns Configured Command instance
   */
  public configure(command: Command): Command {
    return command;
  }

  /**
   * Validate command prerequisites
   * Override this to check if command can run (e.g., check dependencies)
   * 
   * @returns Promise that resolves to true if valid, false otherwise
   */
  public async validate(): Promise<boolean> {
    return true;
  }

  /**
   * Handle errors that occur during command execution
   * Provides consistent error handling across all commands
   * 
   * @param error - The error that occurred
   */
  protected handleError(error: Error): void {
    Logger.error(`Command '${this.name}' failed:`, error);
    process.exit(1);
  }

  /**
   * Safe command execution with error handling
   * Wraps execute() with try-catch and validation
   * 
   * @param options - Command options
   */
  public async run(options: CommandOptions): Promise<void> {
    try {
      // Validate before executing
      const isValid = await this.validate();
      if (!isValid) {
        Logger.error('Command validation failed');
        process.exit(1);
      }

      // Execute the command
      await this.execute(options);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Get command metadata
   * Useful for debugging and command registry
   */
  public getMetadata(): {
    name: string;
    description: string;
    alias?: string;
  } {
    return {
      name: this.name,
      description: this.description,
      alias: this.alias,
    };
  }
}
