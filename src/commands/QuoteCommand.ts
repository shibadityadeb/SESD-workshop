import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
import { QuoteService } from '@/services/QuoteService';
import { ApiError } from '@/errors';
import chalk from 'chalk';

/**
 * Quote Command
 * 
 * Fetches and displays a random inspirational quote.
 * 
 * This command demonstrates:
 * - Integration with zenquotes.io API (no auth required)
 * - Simple API calls without parameters
 * - Beautiful quote formatting
 * - Error handling for API failures
 * 
 * Usage:
 *   devforge quote
 *   devforge q
 */
export class QuoteCommand extends BaseCommand {
  public readonly name = 'quote';
  public readonly description = 'Get a random inspirational quote';
  public readonly aliases = ['q'];
  
  private quoteService: QuoteService;

  constructor() {
    super();
    this.quoteService = new QuoteService();
  }

  /**
   * Configure command options
   */
  public configure(command: Command): Command {
    return command.aliases(this.aliases);
  }

  /**
   * Execute the quote command
   */
  public async execute(_options: CommandOptions): Promise<void> {
    try {
      Logger.loading('Fetching inspirational quote...');

      // Fetch quote
      const quote = await this.quoteService.getRandomQuote();

      Logger.newLine();
      Logger.divider();
      Logger.header('💭 INSPIRATIONAL QUOTE');
      Logger.divider();
      Logger.newLine();

      // Format quote with nice styling
      const wrappedQuote = this.wrapText(quote.content, 60);
      Logger.info(chalk.italic.cyan(`"${wrappedQuote}"`));
      Logger.newLine();
      Logger.info(chalk.bold(`― ${quote.author}`));

      Logger.newLine();
      Logger.success('Quote retrieved successfully');

    } catch (error) {
      Logger.newLine();
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          Logger.error('No quotes available at the moment');
          Logger.warning('Please try again later');
        } else if (error.isNetworkError()) {
          Logger.error('Network error: Unable to connect to Quote API');
          Logger.warning('Please check your internet connection');
        } else {
          Logger.error(`Quote API error (${error.statusCode}): ${error.message}`);
        }
      } else {
        Logger.error('An unexpected error occurred:', error);
      }
      process.exit(1);
    }
  }

  /**
   * Wrap text to specified width for better readability
   */
  private wrapText(text: string, width: number): string {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length <= width) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.join('\n  ');
  }
}
