/**
 * Error handling utilities for the client application
 */

export interface ApiError {
  message: string;
  code: string | undefined;
  statusCode: number | undefined;
  retryable: boolean;
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Parse error response from API
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  let message = 'An unexpected error occurred';
  let code: string | undefined;

  try {
    const data = await response.json();
    message = data.error || data.message || message;
    code = data.code;
  } catch {
    // If JSON parsing fails, use status text
    message = response.statusText || message;
  }

  // Determine if error is retryable based on status code
  const retryable = isRetryableStatusCode(response.status);

  return {
    message: getUserFriendlyMessage(message, response.status),
    code,
    statusCode: response.status,
    retryable,
  };
}

/**
 * Determine if a status code indicates a retryable error
 */
function isRetryableStatusCode(statusCode: number): boolean {
  // 5xx errors are typically retryable
  if (statusCode >= 500) return true;

  // 408 Request Timeout
  if (statusCode === 408) return true;

  // 429 Too Many Requests (with backoff)
  if (statusCode === 429) return true;

  // Client errors (4xx) are generally not retryable
  return false;
}

/**
 * Convert technical error messages to user-friendly ones
 */
function getUserFriendlyMessage(message: string, statusCode?: number): string {
  // Handle specific error messages
  if (message.includes('Insufficient coins')) {
    return "You don't have enough coins for this action. Win battles or wait for your free pull to earn more!";
  }

  if (message.includes('Free pull not available')) {
    return 'Your free pull is still on cooldown. Check back later or use coins to pull now!';
  }

  if (message.includes('slots are full')) {
    return 'This battle is full! All slots have been taken. Try joining another battle or start a new one.';
  }

  if (message.includes('Battle is not active')) {
    return 'This battle has already ended. Check out other active battles or start a new one!';
  }

  if (message.includes('Card not found')) {
    return "This card couldn't be found. It may have been removed or doesn't exist.";
  }

  if (message.includes('Player not found')) {
    return 'Your player profile could not be found. Try refreshing the page or contact support.';
  }

  if (message.includes('User not authenticated')) {
    return 'You need to be logged in to perform this action. Please log in and try again.';
  }

  if (message.includes('Battle not found')) {
    return "This battle couldn't be found. It may have been deleted or doesn't exist.";
  }

  // Handle status code based messages
  if (statusCode === 401) {
    return 'You need to be logged in to perform this action.';
  }

  if (statusCode === 403) {
    return "You don't have permission to perform this action.";
  }

  if (statusCode === 404) {
    return 'The requested resource was not found.';
  }

  if (statusCode === 429) {
    return "You're making too many requests. Please wait a moment and try again.";
  }

  if (statusCode && statusCode >= 500) {
    return 'The server encountered an error. Please try again in a moment.';
  }

  // Return original message if no specific mapping found
  return message;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 10000,
};

/**
 * Fetch with automatic retry logic for network failures
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryConfig: Partial<RetryConfig> = {}
): Promise<Response> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  let lastError: Error | null = null;
  let delay = config.delayMs;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);

      // If response is ok or error is not retryable, return immediately
      if (response.ok || !isRetryableStatusCode(response.status)) {
        return response;
      }

      // For retryable errors, throw to trigger retry
      const apiError = await parseApiError(response);
      throw new NetworkError(apiError.message, response.status, apiError.retryable);
    } catch (error) {
      lastError = error as Error;

      // Don't retry if it's not a network error or not retryable
      if (error instanceof NetworkError && !error.retryable) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === config.maxAttempts) {
        break;
      }

      // Wait before retrying with exponential backoff
      await sleep(Math.min(delay, config.maxDelayMs));
      delay *= config.backoffMultiplier;

      console.log(`Retrying request (attempt ${attempt + 1}/${config.maxAttempts})...`);
    }
  }

  // All retries failed
  throw new NetworkError(
    lastError?.message || 'Network request failed after multiple attempts',
    undefined,
    false
  );
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate if user has sufficient coins for an action
 */
export function validateSufficientCoins(
  currentCoins: number,
  requiredCoins: number
): { valid: boolean; message?: string } {
  if (currentCoins < requiredCoins) {
    return {
      valid: false,
      message: `You need ${requiredCoins} coins but only have ${currentCoins}. Win more battles to earn coins!`,
    };
  }
  return { valid: true };
}

/**
 * Validate if a card exists in player's inventory
 */
export function validateCardOwnership(
  cardId: number,
  inventory: { id: number }[]
): { valid: boolean; message?: string } {
  const hasCard = inventory.some((card) => card.id === cardId);
  if (!hasCard) {
    return {
      valid: false,
      message: "You don't own this card. Visit the Gacha to collect more cards!",
    };
  }
  return { valid: true };
}

/**
 * Validate if battle has available slots
 */
export function validateBattleSlots(
  filledSlots: number,
  maxSlots: number
): { valid: boolean; message?: string } {
  if (filledSlots >= maxSlots) {
    return {
      valid: false,
      message: 'This battle is full! All slots have been taken. Try another battle.',
    };
  }
  return { valid: true };
}

/**
 * Format error for display
 */
export function formatErrorForDisplay(error: unknown): string {
  if (error instanceof NetworkError) {
    return error.message;
  }

  if (error instanceof Error) {
    return getUserFriendlyMessage(error.message);
  }

  if (typeof error === 'string') {
    return getUserFriendlyMessage(error);
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Asset-specific error handling
 */
export class AssetLoadError extends Error {
  constructor(
    message: string,
    public assetPath: string,
    public assetType: 'card' | 'image' | 'other' = 'other'
  ) {
    super(message);
    this.name = 'AssetLoadError';
  }
}

/**
 * Log asset loading errors for monitoring
 */
export function logAssetError(error: AssetLoadError): void {
  const errorData = {
    timestamp: new Date().toISOString(),
    type: 'asset_load_error',
    assetPath: error.assetPath,
    assetType: error.assetType,
    message: error.message,
    userAgent: navigator.userAgent,
  };

  console.error('[Asset Error]', errorData);

  // In production, this would send to a monitoring service
  // For now, we'll store in sessionStorage for debugging
  try {
    const existingErrors = sessionStorage.getItem('asset_errors');
    const errors = existingErrors ? JSON.parse(existingErrors) : [];
    errors.push(errorData);
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.shift();
    }
    sessionStorage.setItem('asset_errors', JSON.stringify(errors));
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Get user-friendly message for asset errors
 */
export function getAssetErrorMessage(assetType: 'card' | 'image' | 'other'): string {
  switch (assetType) {
    case 'card':
      return 'Some card images failed to load. Using placeholder images instead.';
    case 'image':
      return 'Some images failed to load. Please check your connection and try again.';
    default:
      return 'Some assets failed to load. The app may not work as expected.';
  }
}

/**
 * Check if there are recent asset errors
 */
export function hasRecentAssetErrors(): boolean {
  try {
    const existingErrors = sessionStorage.getItem('asset_errors');
    if (!existingErrors) return false;

    const errors = JSON.parse(existingErrors);
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    return errors.some((error: { timestamp: string }) => {
      const errorTime = new Date(error.timestamp).getTime();
      return errorTime > fiveMinutesAgo;
    });
  } catch {
    return false;
  }
}

/**
 * Clear asset error log
 */
export function clearAssetErrors(): void {
  try {
    sessionStorage.removeItem('asset_errors');
  } catch {
    // Ignore storage errors
  }
}
