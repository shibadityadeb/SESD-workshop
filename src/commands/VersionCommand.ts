import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger, OutputFormatter } from '@/utils';
import chalk from 'chalk';
import * as packageJson from '../../package.json';

/**
 * Version Command
 * 
 * Displays the CLI version information.
 * Reads version directly from package.json.
 * 
 * This command demonstrates:
 * - Reading package metadata at runtime
 * - Simple informational command
 * - Support for global flags (--json)
 * 
 * Usage:
 *   devforge version
 *   devforge version --json
 */
export class VersionCommand extends BaseCommand {
  public readonly name = 'version';
  public readonly description = 'Display CLI version information';
  
  /**
   * Configure command options
   */
  public configure(command: Command): Command {
    return command;
  }

  /**
   * Execute the version command
   */
  public async execute(options: CommandOptions): Promise<void> {
    const versionData = {
      version: packageJson.version,
      name: packageJson.name,
      description: packageJson.description,
    };

    // Handle JSON output
    if (options.json) {
      const formatter = new OutputFormatter(options);
      formatter.output(versionData);
      return;
    }

    // Text output with formatting
    Logger.newLine();
    Logger.divider('═');
    console.log(chalk.bold.cyan(`  DevForge CLI`));
    Logger.divider('═');
    Logger.newLine();

    Logger.info(`${chalk.bold('Version:')}     ${chalk.green(packageJson.version)}`);
    Logger.info(`${chalk.bold('Name:')}        ${packageJson.name}`);
    Logger.newLine();
    Logger.info(chalk.gray(packageJson.description));
    Logger.newLine();

    // Handle file saving if requested
    if (options.save) {
      const formatter = new OutputFormatter(options);
      formatter.output(versionData);
    }
  }
}
