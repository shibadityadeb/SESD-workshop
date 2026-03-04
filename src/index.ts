#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import { getCommandRegistry } from '@/registry';
import { Logger } from '@/utils';
import {
  HelloCommand,
  InfoCommand,
  VersionCommand,
  GreetCommand,
  FileInfoCommand,
  HashCommand,
  ValidateEmailCommand,
  SysInfoCommand,
  GitHubUserCommand,
  QuoteCommand,
  JokeCommand,
} from '@/commands';

// Load environment variables
dotenv.config();

/**
 * DevForge CLI Entry Point
 * 
 * This is the main entry point for the CLI application.
 * Uses the Command Registry pattern for managing commands.
 * 
 * Architecture:
 * - Commands are registered with the CommandRegistry
 * - Registry integrates with Commander.js
 * - Each command extends BaseCommand
 * - Centralized error handling and logging
 */

/**
 * Initialize the CLI application
 */
async function initializeCLI(): Promise<void> {
  try {
    // Initialize Commander program
    const program = new Command();

    // CLI Metadata
    program
      .name('devforge')
      .description('DevForge CLI - A production-level CLI tool built with OOP architecture')
      .version('1.0.0')
      .option('-v, --verbose', 'Enable verbose logging')
      .option('--json', 'Output results in JSON format')
      .option('--save <filename>', 'Save output to a file');

    // Get the command registry instance
    const registry = getCommandRegistry();

    // Register utility commands
    registry.register(new HelloCommand());
    registry.register(new InfoCommand());
    registry.register(new VersionCommand());

    // Register core CLI commands
    registry.register(new GreetCommand());
    registry.register(new FileInfoCommand());
    registry.register(new HashCommand());
    registry.register(new ValidateEmailCommand());
    registry.register(new SysInfoCommand());

    // Register API integration commands
    registry.register(new GitHubUserCommand());
    registry.register(new QuoteCommand());
    registry.register(new JokeCommand());
    
    Logger.debug('Command registry initialized with 12 commands');

    // Register all commands with Commander.js
    registry.registerAll(program);

    // Global error handler
    process.on('unhandledRejection', (reason: Error) => {
      Logger.error('Unhandled rejection:', reason);
      process.exit(1);
    });

    process.on('uncaughtException', (error: Error) => {
      Logger.error('Uncaught exception:', error);
      process.exit(1);
    });

    // Parse arguments and execute commands
    program.parse(process.argv);

    // Show help if no command provided
    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
  } catch (error) {
    Logger.error('Failed to initialize CLI:', error);
    process.exit(1);
  }
}

// Start the CLI
initializeCLI();
