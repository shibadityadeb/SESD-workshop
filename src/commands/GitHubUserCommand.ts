import { Command } from 'commander';
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
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
  public readonly name = 'github-user';
  public readonly description = 'Fetch GitHub user information';
  
  private githubService: GitHubApiService;

  constructor() {
    super();
    this.githubService = new GitHubApiService();
  }

  /**
   * Configure command arguments
   */
  public configure(command: Command): Command {
    return command.argument('<username>', 'GitHub username');
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
      Logger.loading(`Fetching user data for: ${username}`);

      // Fetch user data from GitHub API
      const user = await this.githubService.getUser(username);

      Logger.newLine();
      Logger.success('User found!');
      Logger.newLine();

      // Display user information
      Logger.table({
        'Username': user.login,
        'Name': user.name || 'N/A',
        'Bio': user.bio || 'N/A',
        'Public Repos': user.public_repos,
        'Followers': user.followers,
        'Following': user.following,
        'Joined': new Date(user.created_at).toLocaleDateString(),
      });

      Logger.newLine();
      Logger.info(`Profile: https://github.com/${user.login}`);

    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          Logger.error(`User '${username}' not found on GitHub`);
        } else if (error.isNetworkError()) {
          Logger.error('Network error: Unable to connect to GitHub API');
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
