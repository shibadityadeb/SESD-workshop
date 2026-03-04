import { BaseApiService } from './BaseApiService';

/**
 * Joke Interface
 * 
 * Type definition for joke data from Official Joke API
 */
export interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

/**
 * Official Joke API Response
 * Matches the exact structure returned by the API
 */
interface JokeApiResponse {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

/**
 * Joke Service
 * 
 * Service for fetching random jokes from Official Joke API.
 * Uses official-joke-api.appspot.com - a free jokes API (no auth required).
 * 
 * Features:
 * - Fetch random jokes
 * - Clean, family-friendly jokes
 * - No API key required
 * - Various joke types (general, programming, knock-knock)
 * 
 * API: https://official-joke-api.appspot.com/
 * 
 * Usage Example:
 * ```typescript
 * const jokeService = new JokeService();
 * const joke = await jokeService.getRandomJoke();
 * console.log(joke.setup);
 * console.log(joke.punchline);
 * ```
 */
export class JokeService extends BaseApiService {
  constructor() {
    // Official Joke API base URL (free, no auth required)
    super('https://official-joke-api.appspot.com', {
      headers: {
        'Accept': 'application/json',
      },
    });
  }

  /**
   * Get a random joke
   * 
   * @returns Promise with joke data
   */
  public async getRandomJoke(): Promise<Joke> {
    const response = await this.get<JokeApiResponse>('/random_joke');

    // Validate response
    if (!response || !response.setup || !response.punchline) {
      throw new Error('Invalid joke data received from API');
    }

    // Return the joke (API structure matches our Joke interface)
    return {
      id: response.id,
      type: response.type,
      setup: response.setup,
      punchline: response.punchline,
    };
  }

  /**
   * Get a random programming joke
   * 
   * @returns Promise with joke data
   */
  public async getProgrammingJoke(): Promise<Joke> {
    const response = await this.get<JokeApiResponse>('/jokes/programming/random');

    // API returns an array with one joke for this endpoint
    const joke = Array.isArray(response) ? response[0] : response;

    if (!joke || !joke.setup || !joke.punchline) {
      throw new Error('Invalid joke data received from API');
    }

    return {
      id: joke.id,
      type: joke.type,
      setup: joke.setup,
      punchline: joke.punchline,
    };
  }

  /**
   * Validate the joke API is accessible
   * 
   * @returns Promise that resolves to true if API is accessible
   */
  public async validateApiAccess(): Promise<boolean> {
    try {
      await this.getRandomJoke();
      return true;
    } catch {
      return false;
    }
  }
}
