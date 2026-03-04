import { BaseApiService } from './BaseApiService';

/**
 * Quote Interface
 * 
 * Type definition for quote data
 */
export interface Quote {
  content: string;
  author: string;
  tags?: string[];
  length?: number;
}

/**
 * ZenQuotes API Response
 */
interface ZenQuoteResponse {
  q: string;  // quote text
  a: string;  // author
  h: string;  // HTML formatted quote
}

/**
 * Quote Service
 * 
 * Service for fetching random inspirational quotes.
 * Uses zenquotes.io - a free quotes API (no auth required).
 * 
 * Features:
 * - Fetch random quotes
 * - Simple and reliable API
 * - No API key required
 * - Daily quote feature
 * 
 * API Documentation: https://zenquotes.io/api
 * 
 * Usage Example:
 * ```typescript
 * const quoteService = new QuoteService();
 * const quote = await quoteService.getRandomQuote();
 * console.log(`"${quote.content}" - ${quote.author}`);
 * ```
 */
export class QuoteService extends BaseApiService {
  constructor() {
    // ZenQuotes API base URL (free, no auth required)
    super('https://zenquotes.io/api', {
      headers: {
        'Accept': 'application/json',
      },
    });
  }

  /**
   * Get a random quote
   * 
   * @returns Promise with quote data
   */
  public async getRandomQuote(): Promise<Quote> {
    const response = await this.get<ZenQuoteResponse[]>('/random');

    // API returns an array with one quote
    const zenQuote = response[0];

    // Transform API response to our Quote interface
    if (!zenQuote) {
      throw new Error('No quote received from API');
    }

    return {
      content: zenQuote.q,
      author: zenQuote.a,
      length: zenQuote.q.length,
    };
  }

  /**
   * Get quote of the day
   * 
   * @returns Promise with quote data
   */
  public async getQuoteOfTheDay(): Promise<Quote> {
    const response = await this.get<ZenQuoteResponse[]>('/today');

    const zenQuote = response[0];

    if (!zenQuote) {
      throw new Error('No quote received from API');
    }

    return {
      content: zenQuote.q,
      author: zenQuote.a,
      length: zenQuote.q.length,
    };
  }
}
