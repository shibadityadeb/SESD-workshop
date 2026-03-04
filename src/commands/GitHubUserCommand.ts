import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger, OutputFormatter } from '@/utils';
import { Validator } from '@/validators';
import { GitHubApiService } from '@/services/GitHubApiService';
import { ApiError } from '@/errors';

/**
 * GitHub User Command
 * 
 * Fetches and displays GitHub user information.
 * 
 * This command demonstrates:
 * - Using API services
 * - Error handling with custom error types
 * - Input validation
 * - Async operations
 * - Formatted output
 * 
 * Usage:
 *   devforge github-user octocat
 *   devforge github-user torvalds
 */
export class GitHubUserCommand extends BaseCommand {
  public readonly name = 'github';
  public readonly description = 'Fetch GitHub user information';
  public readonly aliases = ['gh'];
  
  private githubService: GitHubApiService;

  constructor() {
    super();
    this.githubService = new GitHubApiService();
  }

  /**
   * Configure command arguments
   */
  public configure(command: Command): Command {
    return command
      .argument('<username>', 'GitHub username to lookup')
      .aliases(this.aliases);
  }

  /**
   * Execute the github-user command
   */
  public async execute(options: CommandOptions): Promise<void> {
    // Get username from arguments
    // When using .argument(), it's passed as options.args[0]
    const args = options.args as string[] | undefined;
    const username = args && args.length > 0 ? args[0] : '';

    // Validate username
    Validator.require(username, 'username');

    // TypeScript now knows username is a non-empty string
    if (!username) {
      Logger.error('Username is required');
      process.exit(1);
    }

    try {
      // Show loading only in text mode
      if (!options.json) {
        Logger.loading('Fetching GitHub user information...');
      }

      // Fetch user data from GitHub API
      const user = await this.githubService.getUser(username);

      // Handle JSON output
      if (options.json) {
        const formatter = new OutputFormatter(options);
        formatter.output(user);
        return;
      }

      // Text output with formatting
      Logger.newLine();
      Logger.divider();
      Logger.header(`👤 GITHUB USER: ${user.login}`);
      Logger.divider();
      Logger.newLine();

      // Basic Information
      if (user.name) {
        Logger.info(`Name:         ${user.name}`);
      }
      if (user.bio) {
        Logger.info(`Bio:          ${user.bio}`);
      }
      if (user.location) {
        Logger.info(`Location:     ${user.location}`);
      }
      if (user.company) {
        Logger.info(`Company:      ${user.company}`);
      }

      Logger.newLine();
      Logger.info('📊 STATS:');
      Logger.info(`  Public Repos:     ${user.public_repos}`);
      Logger.info(`  Followers:        ${user.followers}`);
      Logger.info(`  Following:        ${user.following}`);
      Logger.info(`  Account Created:  ${new Date(user.created_at).toISOString().split('T')[0]}`);

      Logger.newLine();
      Logger.info(`🔗 Profile: ${user.html_url}`);
      Logger.newLine();

      // Handle file saving if requested
      if (options.save) {
        const formatter = new OutputFormatter(options);
        formatter.output(user);
      } else {
        Logger.success('User information retrieved successfully');
      }

    } catch (error) {
      if (!options.json) {
        Logger.newLine();
      }
      
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          Logger.error(`User '${username}' not found on GitHub`);
        } else if (error.isNetworkError()) {
          Logger.error('Network error: Unable to connect to GitHub API');
          Logger.warning('Please check your internet connection');
        } else if (error.statusCode === 403) {
          Logger.error('GitHub API rate limit exceeded');
          Logger.warning('Tip: Add GITHUB_TOKEN to .env for higher rate limits');
        } else {
          Logger.error(`GitHub API error (${error.statusCode}): ${error.message}`);
        }
      } else {
        Logger.error('An unexpected error occurred:', error);
      }
      process.exit(1);
    }
  }
}
