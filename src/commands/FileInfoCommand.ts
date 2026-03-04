import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
import { Validator } from '@/validators';
import { ValidationError, AppError } from '@/errors';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

/**
 * FileInfo Command
 * 
 * Displays detailed information about a file including:
 * - File size (in human-readable format)
 * - Creation date
 * - Last modified date
 * - File extension
 * - Absolute path
 * - File type (file vs directory)
 * 
 * Design Decisions:
 * - Uses Node.js fs module for file operations
 * - Validates file existence before attempting to read
 * - Converts file size to human-readable format (B, KB, MB, GB)
 * - Handles both relative and absolute paths
 * - Provides clear error messages for common issues
 * 
 * Usage Examples:
 *   devforge fileinfo package.json
 *   devforge fileinfo ./src/index.ts
 *   devforge fileinfo /absolute/path/to/file.txt
 * 
 * Learning Points:
 * - Working with Node.js file system API
 * - Path resolution and normalization
 * - File stat information extraction
 * - Date formatting
 * - Human-readable file size conversion
 */
export class FileInfoCommand extends BaseCommand {
  public readonly name = 'fileinfo';
  public readonly description = 'Display detailed information about a file';
  public readonly alias = 'fi';

  /**
   * Configure command to accept a filename argument
   */
  public configure(command: Command): Command {
    return command
      .argument('<filename>', 'Path to the file')
      .addHelpText('after', '\nExamples:\n  $ devforge fileinfo package.json\n  $ devforge fileinfo ./src/index.ts');
  }

  /**
   * Execute the fileinfo command
   * 
   * @param options - Command options containing arguments
   */
  public async execute(options: CommandOptions): Promise<void> {
    // Extract filename from arguments
    const args = options.args as string[] | undefined;
    const filename = args && args.length > 0 ? args[0] : '';

    // Validate filename is provided
    try {
      Validator.require(filename, 'filename');
    } catch (error) {
      if (error instanceof ValidationError) {
        Logger.error('Validation failed:', error);
        Logger.info('Usage: devforge fileinfo <filename>');
        process.exit(1);
      }
      throw error;
    }

    // Resolve to absolute path
    const absolutePath = path.resolve(filename || '');

    // Validate file exists
    try {
      Validator.requireFile(absolutePath, 'file');
    } catch (error) {
      if (error instanceof ValidationError) {
        Logger.error(`File not found: ${filename}`);
        Logger.warning(`Searched at: ${absolutePath}`);
        process.exit(1);
      }
      throw error;
    }

    try {
      // Get file stats
      const stats = fs.statSync(absolutePath);

      // Extract file information
      const fileInfo = {
        name: path.basename(absolutePath),
        extension: path.extname(absolutePath) || 'No extension',
        size: this.formatFileSize(stats.size),
        sizeBytes: stats.size,
        created: stats.birthtime.toLocaleString(),
        modified: stats.mtime.toLocaleString(),
        accessed: stats.atime.toLocaleString(),
        type: stats.isDirectory() ? 'Directory' : 'File',
        path: absolutePath,
        permissions: this.formatPermissions(stats.mode),
      };

      // Display file information
      Logger.newLine();
      Logger.header(`File Information: ${fileInfo.name}`);

      // Create formatted output
      console.log(chalk.cyan('📄 Basic Info'));
      Logger.divider('─', 60);
      Logger.table({
        'File Name': fileInfo.name,
        'Extension': fileInfo.extension,
        'Type': fileInfo.type,
        'Size': `${fileInfo.size} (${fileInfo.sizeBytes.toLocaleString()} bytes)`,
      });

      Logger.newLine();
      console.log(chalk.cyan('📅 Timestamps'));
      Logger.divider('─', 60);
      Logger.table({
        'Created': fileInfo.created,
        'Modified': fileInfo.modified,
        'Accessed': fileInfo.accessed,
      });

      Logger.newLine();
      console.log(chalk.cyan('📁 Path Info'));
      Logger.divider('─', 60);
      Logger.table({
        'Absolute Path': fileInfo.path,
        'Directory': path.dirname(absolutePath),
        'Permissions': fileInfo.permissions,
      });

      Logger.newLine();
      Logger.success('File information retrieved successfully!');

    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(
          `Failed to read file information: ${error.message}`,
          500
        );
      }
      throw error;
    }
  }

  /**
   * Format file size to human-readable format
   * 
   * @param bytes - File size in bytes
   * @returns Formatted size string (e.g., "1.5 MB")
   */
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    // Format to 2 decimal places if not bytes
    const formattedSize = unitIndex === 0 
      ? size.toString() 
      : size.toFixed(2);

    return `${formattedSize} ${units[unitIndex]}`;
  }

  /**
   * Format file permissions to readable string
   * 
   * @param mode - File mode from stats
   * @returns Formatted permissions string
   */
  private formatPermissions(mode: number): string {
    // Extract permission bits (last 3 octal digits)
    const permissions = (mode & parseInt('777', 8)).toString(8);
    
    // Convert to rwx format
    const permissionMap: Record<string, string> = {
      '0': '---',
      '1': '--x',
      '2': '-w-',
      '3': '-wx',
      '4': 'r--',
      '5': 'r-x',
      '6': 'rw-',
      '7': 'rwx',
    };

    const chars = permissions.split('');
    const formatted = chars.map(char => permissionMap[char] || '---').join('');
    
    return `${permissions} (${formatted})`;
  }
}
