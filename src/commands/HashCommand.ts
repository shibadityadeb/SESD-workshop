import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
import { Validator } from '@/validators';
import { ValidationError, AppError } from '@/errors';
import * as crypto from 'crypto';
import chalk from 'chalk';

/**
 * Hash Command
 * 
 * Generates cryptographic hashes for input text using various algorithms.
 * Primary algorithm is SHA256, with options for other algorithms.
 * 
 * Design Decisions:
 * - Uses Node.js crypto module for hash generation
 * - Validates input is not empty
 * - Supports multiple hash algorithms (SHA256, MD5, SHA1, SHA512)
 * - Displays hash in both hex and base64 formats
 * - Case-insensitive algorithm selection
 * 
 * Usage Examples:
 *   devforge hash "Hello World"
 *   devforge hash "password123" --algorithm md5
 *   devforge hash "data" -a sha512
 * 
 * Security Note:
 * - SHA256 is the default and recommended for most uses
 * - MD5 and SHA1 are provided for legacy compatibility
 * - For passwords, use bcrypt or similar (not implemented here)
 * 
 * Learning Points:
 * - Working with Node.js crypto module
 * - Hash algorithm usage
 * - Command options handling
 * - Encoding conversions (hex, base64)
 */
export class HashCommand extends BaseCommand {
  public readonly name = 'hash';
  public readonly description = 'Generate cryptographic hash for input text';
  public readonly alias = 'h';

  // Supported hash algorithms
  private readonly SUPPORTED_ALGORITHMS = [
    'sha256',
    'sha512',
    'sha1',
    'md5',
    'sha384',
  ];

  /**
   * Configure command to accept text argument and algorithm option
   */
  public configure(command: Command): Command {
    return command
      .argument('<text>', 'Text to hash')
      .option(
        '-a, --algorithm <algorithm>',
        `Hash algorithm (${this.SUPPORTED_ALGORITHMS.join(', ')})`,
        'sha256'
      )
      .option(
        '-e, --encoding <encoding>',
        'Output encoding (hex, base64)',
        'hex'
      )
      .addHelpText(
        'after',
        '\nExamples:' +
        '\n  $ devforge hash "Hello World"' +
        '\n  $ devforge hash "password123" --algorithm md5' +
        '\n  $ devforge hash "data" -a sha512 -e base64'
      );
  }

  /**
   * Execute the hash command
   * 
   * @param options - Command options containing arguments and flags
   */
  public async execute(options: CommandOptions): Promise<void> {
    // Extract text from arguments
    const args = options.args as string[] | undefined;
    const text = args && args.length > 0 ? args[0] : '';

    // Extract options
    const algorithm = (options.algorithm as string || 'sha256').toLowerCase();
    const encoding = (options.encoding as string || 'hex').toLowerCase();

    // Validate text is provided and not empty
    try {
      Validator.require(text, 'text');
      
      if (!text || text.trim().length === 0) {
        throw new ValidationError('Text cannot be empty or just whitespace', 'text');
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        Logger.error('Validation failed:', error);
        Logger.info('Usage: devforge hash <text>');
        process.exit(1);
      }
      throw error;
    }

    // TypeScript now knows text is non-null
    if (!text) return;

    // Validate algorithm
    if (!this.SUPPORTED_ALGORITHMS.includes(algorithm)) {
      Logger.error(
        `Unsupported algorithm: ${algorithm}`
      );
      Logger.info(
        `Supported algorithms: ${this.SUPPORTED_ALGORITHMS.join(', ')}`
      );
      process.exit(1);
    }

    // Validate encoding
    if (!['hex', 'base64'].includes(encoding)) {
      Logger.error(`Unsupported encoding: ${encoding}`);
      Logger.info('Supported encodings: hex, base64');
      process.exit(1);
    }

    try {
      // Generate hash
      const hash = crypto
        .createHash(algorithm)
        .update(text)
        .digest(encoding as 'hex' | 'base64');

      // Calculate input statistics
      const byteLength = Buffer.byteLength(text, 'utf8');
      const charCount = text.length;

      // Display results
      Logger.newLine();
      Logger.header(`Hash Generation: ${algorithm.toUpperCase()}`);

      // Input information
      console.log(chalk.cyan('📝 Input'));
      Logger.divider('─', 60);
      Logger.table({
        'Text Preview': text.length > 50 ? text.substring(0, 47) + '...' : text,
        'Character Count': charCount,
        'Byte Size': `${byteLength} bytes`,
      });

      Logger.newLine();
      console.log(chalk.cyan('🔐 Hash Output'));
      Logger.divider('─', 60);
      Logger.table({
        'Algorithm': algorithm.toUpperCase(),
        'Encoding': encoding.toUpperCase(),
        'Hash Length': `${hash.length} characters`,
      });

      Logger.newLine();
      console.log(chalk.yellow.bold('Hash Value:'));
      console.log(chalk.white(hash));

      // Generate alternative encodings for comparison
      if (encoding === 'hex') {
        const base64Hash = crypto
          .createHash(algorithm)
          .update(text)
          .digest('base64');
        Logger.newLine();
        console.log(chalk.gray('Base64 encoding:'));
        console.log(chalk.gray(base64Hash));
      } else {
        const hexHash = crypto
          .createHash(algorithm)
          .update(text)
          .digest('hex');
        Logger.newLine();
        console.log(chalk.gray('Hex encoding:'));
        console.log(chalk.gray(hexHash));
      }

      Logger.newLine();
      Logger.success('Hash generated successfully!');

      // Security warnings
      if (algorithm === 'md5' || algorithm === 'sha1') {
        Logger.newLine();
        Logger.warning(
          `⚠️  ${algorithm.toUpperCase()} is considered cryptographically weak.` +
          '\n   Consider using SHA256 or SHA512 for security-critical applications.'
        );
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(
          `Failed to generate hash: ${error.message}`,
          500
        );
      }
      throw error;
    }
  }
}
