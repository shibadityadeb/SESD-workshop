import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger, OutputFormatter } from '@/utils';
import { JokeService } from '@/services/JokeService';
import { ApiError } from '@/errors';
import chalk from 'chalk';

/**
 * Joke Command
 * 
 * Fetches and displays a random joke.
 * 
 * This command demonstrates:
 * - Integration with Official Joke API (no auth required)
 * - Simple API calls without parameters
 * - Beautiful joke formatting
 * - Support for global flags (--json, --save)
 * - Error handling for API failures
 * 
 * Usage:
 *   devforge joke
 *   devforge j
 *   devforge joke --json
 *   devforge joke --save joke.txt
 */
export class JokeCommand extends BaseCommand {
  public readonly name = 'joke';
  public readonly description = 'Get a random joke';
  public readonly aliases = ['j'];
  
  private jokeService: JokeService;

  constructor() {
    super();
    this.jokeService = new JokeService();
  }

  /**
   * Configure command options
   */
  public configure(command: Command): Command {
    return command.aliases(this.aliases);
  }

  /**
   * Execute the joke command
   */
  public async execute(options: CommandOptions): Promise<void> {
    try {
      // Show loading only in text mode
      if (!options.json) {
        Logger.loading('Fetching joke...');
      }

      // Fetch joke
      const joke = await this.jokeService.getRandomJoke();

      // Handle JSON output
      if (options.json) {
        const formatter = new OutputFormatter(options);
        formatter.output(joke);
        return;
      }

      // Text output with formatting
      Logger.newLine();
      Logger.divider();
      Logger.header('😂 RANDOM JOKE');
      Logger.divider();
      Logger.newLine();

      // Display joke setup
      Logger.info(chalk.cyan.bold('Setup:'));
      Logger.info(`  ${joke.setup}`);
      Logger.newLine();

      // Display punchline with emphasis
      Logger.info(chalk.yellow.bold('Punchline:'));
      Logger.info(chalk.italic(`  ${joke.punchline}`));
      Logger.newLine();

      // Show joke type
      if (joke.type) {
        Logger.info(chalk.gray(`Type: ${joke.type}`));
        Logger.newLine();
      }

      // Handle file saving if requested
      if (options.save) {
        const formatter = new OutputFormatter(options);
        const formattedData = {
          setup: joke.setup,
          punchline: joke.punchline,
          type: joke.type,
          id: joke.id,
        };
        formatter.output(formattedData);
      } else {
        Logger.success('Joke retrieved successfully');
      }

    } catch (error) {
      if (!options.json) {
        Logger.newLine();
      }
      
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          Logger.error('No jokes available at the moment');
          Logger.warning('Please try again later');
        } else if (error.isNetworkError()) {
          Logger.error('Network error: Unable to connect to Joke API');
          Logger.warning('Please check your internet connection');
        } else {
          Logger.error(`Joke API error (${error.statusCode}): ${error.message}`);
        }
      } else {
        Logger.error('An unexpected error occurred:', error);
      }
      process.exit(1);
    }
  }
}
