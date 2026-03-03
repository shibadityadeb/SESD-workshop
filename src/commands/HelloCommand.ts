import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
import { Validator } from '@/validators';

/**
 * Hello Command
 * 
 * Example command that demonstrates:
 * - Extending BaseCommand
 * - Adding custom options
 * - Using the Logger utility
 * - Input validation
 * 
 * Usage:
 *   devforge hello
 *   devforge hello --name John
 *   devforge hello -n "Alice"
 */
export class HelloCommand extends BaseCommand {
  public readonly name = 'hello';
  public readonly description = 'Say hello to someone';
  public readonly alias = 'hi';

  /**
   * Configure command options
   * Add --name option to the command
   */
  public configure(command: Command): Command {
    return command
      .option('-n, --name <name>', 'Name of the person to greet', 'World');
  }

  /**
   * Validate command input
   * Ensure name is not empty
   */
  public async validate(): Promise<boolean> {
    // You can add validation logic here if needed
    return true;
  }

  /**
   * Execute the hello command
   */
  public async execute(options: CommandOptions): Promise<void> {
    const name = options.name as string;

    // Validate name input
    const validation = Validator.validateRequired(name, 'name');
    if (!validation.isValid) {
      Logger.error(validation.error || 'Name is required');
      return;
    }

    // Display greeting
    Logger.success(`Hello, ${name}!`);
    Logger.info(`Welcome to DevForge CLI`);
  }
}
