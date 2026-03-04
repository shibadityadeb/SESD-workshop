import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
import { Validator } from '@/validators';
import chalk from 'chalk';

/**
 * Validate Email Command
 * 
 * Validates email addresses using the Validator utility.
 * Provides detailed feedback on email validity and format.
 * 
 * Design Decisions:
 * - Leverages existing Validator.validateEmail() method
 * - Demonstrates reuse of validation layer
 * - Provides detailed breakdown of email components
 * - Shows both valid and invalid examples
 * - Can validate multiple emails in batch mode
 * 
 * Usage Examples:
 *   devforge validate-email user@example.com
 *   devforge validate-email john.doe@company.co.uk
 *   devforge validate-email invalid-email
 * 
 * Email Validation Rules:
 * - Must contain @ symbol
 * - Must have local part (before @)
 * - Must have domain part (after @)
 * - Domain must have at least one dot
 * - No whitespace allowed
 * 
 * Learning Points:
 * - Reusing validator utilities
 * - Email format parsing
 * - Detailed validation feedback
 * - User-friendly error messages
 */
export class ValidateEmailCommand extends BaseCommand {
  public readonly name = 'validate-email';
  public readonly description = 'Validate email address format';
  public readonly alias = 've';

  /**
   * Configure command to accept email argument
   */
  public configure(command: Command): Command {
    return command
      .argument('<email>', 'Email address to validate')
      .option('-v, --verbose', 'Show detailed validation information')
      .addHelpText(
        'after',
        '\nExamples:' +
        '\n  $ devforge validate-email user@example.com' +
        '\n  $ devforge validate-email john.doe+tag@company.co.uk' +
        '\n  $ devforge validate-email invalid-email -v'
      );
  }

  /**
   * Execute the validate-email command
   * 
   * @param options - Command options containing arguments
   */
  public async execute(options: CommandOptions): Promise<void> {
    // Extract email from arguments
    const args = options.args as string[] | undefined;
    const email = args && args.length > 0 ? args[0] : '';
    const verbose = options.verbose as boolean || false;

    // Check if email argument was provided
    if (!email) {
      Logger.error('Email address is required');
      Logger.info('Usage: devforge validate-email <email>');
      process.exit(1);
    }

    // Validate email using Validator utility
    const result = Validator.validateEmail(email);

    // Display validation results
    Logger.newLine();
    Logger.header('Email Validation');

    // Email being validated
    console.log(chalk.cyan('📧 Email Address'));
    Logger.divider('─', 60);
    console.log(chalk.white(`  ${email}`));
    Logger.newLine();

    // Validation result
    if (result.isValid) {
      // Valid email
      console.log(
        chalk.green.bold('✓ VALID') +
        chalk.gray(' - This email address is correctly formatted')
      );
      
      // Parse email components
      const [localPart, domainPart] = email.split('@');
      const domainParts = domainPart?.split('.') || [];
      const topLevelDomain = domainParts[domainParts.length - 1] || '';

      Logger.newLine();
      console.log(chalk.cyan('📋 Email Components'));
      Logger.divider('─', 60);
      Logger.table({
        'Local Part': localPart || '',
        'Domain': domainPart || '',
        'TLD': topLevelDomain.toUpperCase(),
        'Format': `${localPart?.length || 0} chars @ ${domainPart?.length || 0} chars`,
      });

      // Verbose information
      if (verbose) {
        Logger.newLine();
        console.log(chalk.cyan('🔍 Detailed Analysis'));
        Logger.divider('─', 60);
        
        const analysis = this.analyzeEmail(email);
        Object.entries(analysis).forEach(([key, value]) => {
          const icon = value ? '✓' : '✗';
          const color = value ? chalk.green : chalk.gray;
          console.log(color(`  ${icon} ${key}`));
        });
      }

      Logger.newLine();
      Logger.success('Email validation passed!');

    } else {
      // Invalid email
      console.log(
        chalk.red.bold('✗ INVALID') +
        chalk.gray(' - This email address has formatting errors')
      );
      
      Logger.newLine();
      console.log(chalk.red('❌ Error Details'));
      Logger.divider('─', 60);
      console.log(chalk.white(`  ${result.error || 'Unknown error'}`));

      // Provide helpful suggestions
      Logger.newLine();
      console.log(chalk.yellow('💡 Valid Email Format:'));
      Logger.divider('─', 60);
      console.log(chalk.gray('  • Must contain exactly one @ symbol'));
      console.log(chalk.gray('  • Must have a local part (before @)'));
      console.log(chalk.gray('  • Must have a domain (after @)'));
      console.log(chalk.gray('  • Domain must contain at least one dot'));
      console.log(chalk.gray('  • No whitespace allowed'));
      
      Logger.newLine();
      console.log(chalk.yellow('Examples of valid emails:'));
      console.log(chalk.gray('  • user@example.com'));
      console.log(chalk.gray('  • john.doe@company.co.uk'));
      console.log(chalk.gray('  • alice+tag@email-service.org'));

      Logger.newLine();
      Logger.error('Email validation failed!');
      process.exit(1);
    }
  }

  /**
   * Analyze email for detailed validation information
   * 
   * @param email - Email to analyze
   * @returns Analysis results
   */
  private analyzeEmail(email: string): Record<string, boolean> {
    const [localPart, domainPart] = email.split('@');
    
    return {
      'Has @ symbol': email.includes('@'),
      'Has local part': Boolean(localPart && localPart.length > 0),
      'Has domain part': Boolean(domainPart && domainPart.length > 0),
      'Domain has dot': Boolean(domainPart && domainPart.includes('.')),
      'No whitespace': !/\s/.test(email),
      'Valid length': email.length >= 5 && email.length <= 254,
      'Local part length OK': Boolean(localPart && localPart.length <= 64),
      'Domain not empty': Boolean(domainPart && domainPart.length > 0),
      'Starts with alphanumeric': Boolean(localPart && /^[a-zA-Z0-9]/.test(localPart)),
      'No consecutive dots': !email.includes('..'),
    };
  }
}
