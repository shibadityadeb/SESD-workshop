import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
import chalk from 'chalk';

/**
 * Info Command
 * 
 * Displays CLI information and metadata.
 * 
 * Example command that demonstrates:
 * - Simple command without options
 * - Using Logger utility methods
 * - Displaying formatted output
 * 
 * Usage:
 *   devforge info
 */
export class InfoCommand extends BaseCommand {
  public readonly name = 'info';
  public readonly description = 'Display CLI information';

  /**
   * Execute the info command
   */
  public async execute(_options: CommandOptions): Promise<void> {
    Logger.header('DevForge CLI Information');

    // Display information in a table format
    Logger.table({
      'Name': 'DevForge CLI',
      'Version': '1.0.0',
      'Description': 'Production-level CLI tool',
      'Architecture': 'OOP with TypeScript',
      'Framework': 'Commander.js',
    });

    Logger.newLine();
    
    // Display features
    console.log(chalk.cyan.bold('Features:'));
    const features = [
      'OOP Architecture with SOLID principles',
      'Type-safe command system',
      'Centralized error handling',
      'Input validation layer',
      'Extensible API service base',
      'Beautiful colored output',
      'Environment variable support',
    ];

    features.forEach(feature => {
      console.log(chalk.gray('  •'), chalk.white(feature));
    });

    Logger.newLine();
    Logger.success('CLI is ready to use!');
  }
}
