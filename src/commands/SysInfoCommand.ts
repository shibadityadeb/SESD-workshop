import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
import { AppError } from '@/errors';
import * as os from 'os';
import chalk from 'chalk';

/**
 * System Info Command
 * 
 * Displays comprehensive system information including:
 * - Operating system details
 * - CPU information
 * - Memory usage
 * - Network interfaces
 * - System uptime
 * 
 * Design Decisions:
 * - Uses Node.js os module for system introspection
 * - No validation needed (reads system info)
 * - Formats memory values in human-readable format
 * - Calculates memory usage percentages
 * - Shows CPU core information
 * - Displays system uptime in readable format
 * 
 * Usage Examples:
 *   devforge sysinfo
 *   devforge sysinfo --detailed
 * 
 * Learning Points:
 * - Working with Node.js os module
 * - System information retrieval
 * - Data formatting and presentation
 * - Memory and CPU information
 */
export class SysInfoCommand extends BaseCommand {
  public readonly name = 'sysinfo';
  public readonly description = 'Display system information';
  public readonly alias = 'si';

  /**
   * Configure command options
   */
  public configure(command: any): any {
    return command
      .option('-d, --detailed', 'Show detailed system information')
      .addHelpText(
        'after',
        '\nExamples:' +
        '\n  $ devforge sysinfo' +
        '\n  $ devforge sysinfo --detailed'
      );
  }

  /**
   * Execute the sysinfo command
   * 
   * @param options - Command options
   */
  public async execute(options: CommandOptions): Promise<void> {
    const detailed = options.detailed as boolean || false;

    try {
      // Gather system information
      const sysInfo = this.gatherSystemInfo();

      // Display system information
      Logger.newLine();
      Logger.header('System Information');

      // Operating System
      console.log(chalk.cyan('💻 Operating System'));
      Logger.divider('─', 60);
      Logger.table({
        'OS Type': sysInfo.os.type,
        'Platform': sysInfo.os.platform,
        'Release': sysInfo.os.release,
        'Architecture': sysInfo.os.arch,
        'Hostname': sysInfo.os.hostname,
      });

      // CPU Information
      Logger.newLine();
      console.log(chalk.cyan('🔧 CPU'));
      Logger.divider('─', 60);
      Logger.table({
        'Model': sysInfo.cpu.model,
        'Cores': sysInfo.cpu.cores,
        'Speed': `${sysInfo.cpu.speed} MHz`,
      });

      // Memory Information
      Logger.newLine();
      console.log(chalk.cyan('🧠 Memory'));
      Logger.divider('─', 60);
      
      const memoryUsagePercent = (
        ((sysInfo.memory.total - sysInfo.memory.free) / sysInfo.memory.total) * 100
      ).toFixed(2);
      
      Logger.table({
        'Total Memory': this.formatBytes(sysInfo.memory.total),
        'Free Memory': this.formatBytes(sysInfo.memory.free),
        'Used Memory': this.formatBytes(sysInfo.memory.total - sysInfo.memory.free),
        'Usage': `${memoryUsagePercent}%`,
      });

      // Visual memory bar
      Logger.newLine();
      this.displayMemoryBar(
        sysInfo.memory.total - sysInfo.memory.free,
        sysInfo.memory.total
      );

      // System Uptime
      Logger.newLine();
      console.log(chalk.cyan('⏱️  System Uptime'));
      Logger.divider('─', 60);
      Logger.table({
        'Uptime': this.formatUptime(sysInfo.uptime),
        'Running Since': new Date(Date.now() - sysInfo.uptime * 1000).toLocaleString(),
      });

      // Detailed information
      if (detailed) {
        // Node.js Information
        Logger.newLine();
        console.log(chalk.cyan('🟢 Node.js'));
        Logger.divider('─', 60);
        Logger.table({
          'Version': process.version,
          'V8 Version': process.versions.v8,
          'Process ID': process.pid,
          'Process Uptime': this.formatUptime(process.uptime()),
        });

        // Network Interfaces
        Logger.newLine();
        console.log(chalk.cyan('🌐 Network Interfaces'));
        Logger.divider('─', 60);
        
        const interfaces = os.networkInterfaces();
        const interfaceCount = Object.keys(interfaces).length;
        console.log(chalk.white(`  Found ${interfaceCount} network interface(s):\n`));
        
        Object.entries(interfaces).forEach(([name, addresses]) => {
          console.log(chalk.yellow(`  ${name}:`));
          addresses?.forEach((addr) => {
            if (addr.family === 'IPv4') {
              console.log(chalk.gray(`    IPv4: ${addr.address}`));
            }
          });
        });

        // User Information
        Logger.newLine();
        console.log(chalk.cyan('👤 User'));
        Logger.divider('─', 60);
        Logger.table({
          'Username': os.userInfo().username,
          'Home Directory': os.userInfo().homedir,
          'Shell': os.userInfo().shell || 'N/A',
        });

        // System Directories
        Logger.newLine();
        console.log(chalk.cyan('📁 System Directories'));
        Logger.divider('─', 60);
        Logger.table({
          'Temp Directory': os.tmpdir(),
          'End of Line': os.EOL === '\n' ? 'LF (\\n)' : 'CRLF (\\r\\n)',
        });
      }

      Logger.newLine();
      Logger.success('System information retrieved successfully!');

      if (!detailed) {
        Logger.newLine();
        Logger.info('💡 Use --detailed flag for more information');
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(
          `Failed to retrieve system information: ${error.message}`,
          500
        );
      }
      throw error;
    }
  }

  /**
   * Gather all system information
   * 
   * @returns System information object
   */
  private gatherSystemInfo() {
    const cpus = os.cpus();
    
    return {
      os: {
        type: os.type(),
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        hostname: os.hostname(),
      },
      cpu: {
        model: cpus[0]?.model || 'Unknown',
        cores: cpus.length,
        speed: cpus[0]?.speed || 0,
      },
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
      },
      uptime: os.uptime(),
    };
  }

  /**
   * Format bytes to human-readable format
   * 
   * @param bytes - Number of bytes
   * @returns Formatted string (e.g., "8.5 GB")
   */
  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Format uptime to human-readable format
   * 
   * @param seconds - Uptime in seconds
   * @returns Formatted string (e.g., "2 days, 5 hours, 30 minutes")
   */
  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];
    
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (secs > 0 && parts.length === 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);

    return parts.join(', ') || '0 seconds';
  }

  /**
   * Display visual memory usage bar
   * 
   * @param used - Used memory in bytes
   * @param total - Total memory in bytes
   */
  private displayMemoryBar(used: number, total: number): void {
    const percentage = (used / total) * 100;
    const barLength = 40;
    const filledLength = Math.round((percentage / 100) * barLength);
    
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    
    let color = chalk.green;
    if (percentage > 80) {
      color = chalk.red;
    } else if (percentage > 60) {
      color = chalk.yellow;
    }

    console.log(
      chalk.gray('  Memory Usage: ') +
      color(`[${bar}] ${percentage.toFixed(1)}%`)
    );
  }
}
