import { Command } from 'commander';
import { BaseCommand } from '@/commands';
import { Logger } from '@/utils';

/**
 * Command Registry Class
 * 
 * Central registry for all CLI commands.
 * Manages command registration and integration with Commander.js.
 * 
 * Design Pattern: Singleton + Registry Pattern
 * - Singleton: Ensures only one registry instance exists
 * - Registry: Centralized storage and management of commands
 * 
 * Responsibilities:
 * - Register commands dynamically
 * - Integrate commands with Commander.js
 * - Prevent duplicate command registration
 * - Provide command discovery
 * 
 * Benefits:
 * - Single source of truth for all commands
 * - Type-safe command management
 * - Easy to add new commands without modifying main file
 * - Automatic command configuration
 * 
 * Usage Example:
 * ```typescript
 * const registry = CommandRegistry.getInstance();
 * registry.register(new InitCommand());
 * registry.register(new DeployCommand());
 * registry.registerAll(program);
 * ```
 */
export class CommandRegistry {
  private static instance: CommandRegistry;
  private commands: Map<string, BaseCommand>;

  /**
   * Private constructor to enforce Singleton pattern
   */
  private constructor() {
    this.commands = new Map<string, BaseCommand>();
  }

  /**
   * Get the singleton instance of CommandRegistry
   * 
   * @returns The CommandRegistry instance
   */
  public static getInstance(): CommandRegistry {
    if (!CommandRegistry.instance) {
      CommandRegistry.instance = new CommandRegistry();
    }
    return CommandRegistry.instance;
  }

  /**
   * Register a single command
   * 
   * @param command - Command instance to register
   * @throws Error if command with same name already exists
   */
  public register(command: BaseCommand): void {
    if (this.commands.has(command.name)) {
      throw new Error(`Command '${command.name}' is already registered`);
    }

    Logger.debug(`Registering command: ${command.name}`);
    this.commands.set(command.name, command);
  }

  /**
   * Register multiple commands at once
   * 
   * @param commands - Array of command instances
   */
  public registerMultiple(commands: BaseCommand[]): void {
    commands.forEach(command => this.register(command));
  }

  /**
   * Get a command by name
   * 
   * @param name - Command name
   * @returns Command instance or undefined if not found
   */
  public getCommand(name: string): BaseCommand | undefined {
    return this.commands.get(name);
  }

  /**
   * Get all registered commands
   * 
   * @returns Array of all command instances
   */
  public getAllCommands(): BaseCommand[] {
    return Array.from(this.commands.values());
  }

  /**
   * Check if a command is registered
   * 
   * @param name - Command name
   * @returns True if command exists
   */
  public hasCommand(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * Unregister a command
   * 
   * @param name - Command name
   * @returns True if command was removed, false if not found
   */
  public unregister(name: string): boolean {
    return this.commands.delete(name);
  }

  /**
   * Clear all registered commands
   */
  public clear(): void {
    this.commands.clear();
  }

  /**
   * Get the number of registered commands
   * 
   * @returns Count of commands
   */
  public count(): number {
    return this.commands.size;
  }

  /**
   * Register all commands with Commander.js program
   * This integrates our command architecture with Commander.js
   * 
   * @param program - Commander.js Command instance
   */
  public registerAll(program: Command): void {
    if (this.commands.size === 0) {
      Logger.warning('No commands registered');
      return;
    }

    Logger.debug(`Registering ${this.commands.size} commands with Commander.js`);

    // Register each command with Commander
    this.commands.forEach(command => {
      const commandInstance = program
        .command(command.name)
        .description(command.description);

      // Apply alias if defined
      if (command.alias) {
        commandInstance.alias(command.alias);
      }

      // Allow command to configure itself (add options, arguments, etc.)
      const configuredCommand = command.configure(commandInstance);

      // Set the action handler
      configuredCommand.action(async (...args) => {
        try {
          // Commander.js passes arguments followed by the Command object
          // e.g., for: command.argument('<username>').option('-f, --force')
          // args will be: [usernameValue, commandObject]
          const commandObj = args[args.length - 1];
          const commandOptions = commandObj.opts();
          
          // Get global options from parent program
          const globalOptions = commandObj.parent?.opts() || {};
          
          // Extract positional arguments (all args except the last one which is commandObj)
          const positionalArgs = args.slice(0, -1);
          
          // Merge global options, command options, and args
          // Priority: command options > global options
          const mergedOptions = {
            ...globalOptions,      // Global flags (--json, --save, --verbose)
            ...commandOptions,     // Command-specific options
            args: positionalArgs,  // Positional arguments
          };

          // Execute the command
          await command.run(mergedOptions);
        } catch (error) {
          Logger.error(`Command '${command.name}' execution failed:`, error);
          process.exit(1);
        }
      });
    });

    Logger.debug('All commands registered successfully');
  }

  /**
   * Print all registered commands (useful for debugging)
   */
  public printCommands(): void {
    Logger.header('Registered Commands');

    if (this.commands.size === 0) {
      Logger.info('No commands registered');
      return;
    }

    this.commands.forEach(command => {
      const metadata = command.getMetadata();
      console.log(
        `  ${metadata.name.padEnd(15)} ${metadata.description}`
      );
      if (metadata.alias) {
        console.log(`    Alias: ${metadata.alias}`);
      }
    });

    Logger.newLine();
  }

  /**
   * Auto-discover and register commands from a directory
   * This is useful for automatic command loading
   * 
   * Note: This is a placeholder. Actual implementation would require
   * dynamic imports and file system operations.
   * 
   * @param commandsPath - Path to commands directory
   */
  public async autoRegister(commandsPath: string): Promise<void> {
    Logger.debug(`Auto-registering commands from: ${commandsPath}`);
    
    // Implementation would:
    // 1. Read all files from commandsPath
    // 2. Dynamically import each file
    // 3. Check if it exports a class extending BaseCommand
    // 4. Instantiate and register

    // This is left as an exercise / future enhancement
    throw new Error('Auto-registration not yet implemented');
  }
}

/**
 * Helper function to get the singleton instance
 * Provides a cleaner API for accessing the registry
 */
export const getCommandRegistry = (): CommandRegistry => {
  return CommandRegistry.getInstance();
};
