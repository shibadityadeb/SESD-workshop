import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
import { Validator } from '@/validators';
import { ValidationError } from '@/errors';
import chalk from 'chalk';

/**
 * Greet Command
 * 
 * A friendly greeting command that demonstrates:
 * - Argument handling
 * - Input validation
 * - Styled console output
 * - Error handling
 * 
 * Design Decisions:
 * - Uses Commander's .argument() for positional arguments
 * - Validates that name is provided and not empty
 * - Creates a visually appealing greeting with borders
 * - Shows timestamp for a personal touch
 * 
 * Usage Examples:
 *   devforge greet Alice
 *   devforge greet "John Doe"
 *   devforge greet Developer
 * 
 * Learning Points:
 * - How to handle required arguments
 * - Using Validator for input validation
 * - Creating styled output with chalk and Logger
 * - Throwing ValidationError for invalid input
 */
export class GreetCommand extends BaseCommand {
  public readonly name = 'greet';
  public readonly description = 'Print a styled greeting message';
  public readonly alias = 'g';

  /**
   * Configure command to accept a name argument
   * The argument is required (wrapped in < >)
   */
  public configure(command: Command): Command {
    return command
      .argument('<name>', 'Name of the person to greet')
      .addHelpText('after', '\nExamples:\n  $ devforge greet Alice\n  $ devforge greet "John Doe"');
  }

  /**
   * Validate that name is provided
   * This runs before execute()
   */
  public async validate(): Promise<boolean> {
    // Validation happens in execute() since we need access to the argument
    return true;
  }

  /**
   * Execute the greet command
   * 
   * @param options - Command options containing arguments
   */
  public async execute(options: CommandOptions): Promise<void> {
    // Extract name from positional arguments
    const args = options.args as string[] | undefined;
    const name = args && args.length > 0 ? args[0] : '';

    // Validate name using Validator utility
    try {
      Validator.require(name, 'name');
      
      // Additional validation: check that name is not just whitespace
      if (!name || name.trim().length === 0) {
        throw new ValidationError('Name cannot be empty or just whitespace', 'name');
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        Logger.error('Validation failed:', error);
        Logger.info('Usage: devforge greet <name>');
        process.exit(1);
      }
      throw error;
    }

    // Create a styled greeting
    const trimmedName = name.trim();
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Display greeting with visual appeal
    Logger.newLine();
    Logger.divider('═', 60);
    
    console.log(
      chalk.cyan.bold('  👋 Hello, ') +
      chalk.yellow.bold(trimmedName) +
      chalk.cyan.bold('!')
    );
    
    console.log(
      chalk.gray('  Welcome to DevForge CLI')
    );
    
    console.log(
      chalk.gray(`  Current time: ${currentTime}`)
    );
    
    Logger.divider('═', 60);
    Logger.newLine();

    // Additional friendly messages based on name
    if (trimmedName.toLowerCase() === 'world') {
      Logger.info('🌍 Hello to everyone around the globe!');
    } else {
      Logger.success(`Great to have you here, ${trimmedName}!`);
    }
  }
}
