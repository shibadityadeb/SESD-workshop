import { BaseApiService } from './BaseApiService';

/**
 * GitHub User Interface
 * 
 * Type definition for GitHub user data
 */
export interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;
  avatar_url: string;
}

/**
 * GitHub API Service
 * 
 * Example service that demonstrates:
 * - Extending BaseApiService
 * - Type-safe API responses
 * - Using HTTP methods (GET, POST, etc.)
 * - Error handling
 * 
 * Usage Example:
 * ```typescript
 * const githubService = new GitHubApiService();
 * const user = await githubService.getUser('octocat');
 * console.log(user.name);
 * ```
 */
export class GitHubApiService extends BaseApiService {
  constructor() {
    // GitHub API base URL
    super('https://api.github.com', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });
  }

  /**
   * Get a GitHub user by username
   * 
   * @param username - GitHub username
   * @returns Promise with user data
   */
  public async getUser(username: string): Promise<GitHubUser> {
    return this.get<GitHubUser>(`/users/${username}`);
  }

  /**
   * Get user's repositories
   * 
   * @param username - GitHub username
   * @returns Promise with array of repositories
   */
  public async getUserRepos(username: string): Promise<unknown[]> {
    return this.get<unknown[]>(`/users/${username}/repos`);
  }

  /**
   * Search repositories
   * 
   * @param query - Search query
   * @returns Promise with search results
   */
  public async searchRepos(query: string): Promise<unknown> {
    return this.get<unknown>('/search/repositories', {
      params: { q: query },
    });
  }

  /**
   * Set authentication token
   * Required for authenticated requests (higher rate limits)
   * 
   * @param token - GitHub Personal Access Token
   */
  public authenticate(token: string): void {
    this.setAuthToken(token);
  }
}
