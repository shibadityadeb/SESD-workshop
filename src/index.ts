#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Commander
const program = new Command();

// CLI Metadata
program
  .name('devforge')
  .description(chalk.cyan('DevForge CLI - A production-level CLI tool'))
  .version('1.0.0');

// Example command: Hello
program
  .command('hello')
  .description('Say hello')
  .option('-n, --name <name>', 'Your name', 'World')
  .action((options) => {
    console.log(chalk.green(`Hello, ${options.name}!`));
  });

// Example command: Info
program
  .command('info')
  .description('Display CLI information')
  .action(() => {
    console.log(chalk.blue.bold('\n📦 DevForge CLI'));
    console.log(chalk.gray('━'.repeat(50)));
    console.log(chalk.white('Version:'), chalk.yellow('1.0.0'));
    console.log(chalk.white('Description:'), 'Production-level CLI tool');
    console.log(chalk.white('Built with:'), chalk.cyan('Node.js & TypeScript'));
    console.log(chalk.gray('━'.repeat(50) + '\n'));
  });

// Parse arguments and execute commands
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
