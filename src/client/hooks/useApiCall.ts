import { useState, useCallback } from 'react';
import {
  fetchWithRetry,
  parseApiError,
  formatErrorForDisplay,
  ApiError,
  RetryConfig,
} from '../utils/errorHandling';

interface UseApiCallOptions {
  retryConfig?: Partial<RetryConfig>;
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

interface UseApiCallResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (url: string, options?: RequestInit) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for making API calls with automatic error handling and retry logic
 */
export function useApiCall<T = unknown>(options: UseApiCallOptions = {}): UseApiCallResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (url: string, requestOptions?: RequestInit): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchWithRetry(url, requestOptions, options.retryConfig);

        if (!response.ok) {
          const apiError = await parseApiError(response);
          setError(apiError);
          options.onError?.(apiError);
          return null;
        }

        const result = await response.json();
        setData(result);
        options.onSuccess?.();
        return result;
      } catch (err) {
        const errorMessage = formatErrorForDisplay(err);
        const apiError: ApiError = {
          message: errorMessage,
          code: undefined,
          statusCode: undefined,
          retryable: true,
        };
        setError(apiError);
        options.onError?.(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook specifically for GET requests
 */
export function useApiGet<T = unknown>(
  url: string | null,
  options: UseApiCallOptions & { autoFetch?: boolean } = {}
): UseApiCallResult<T> & { refetch: () => Promise<T | null> } {
  const apiCall = useApiCall<T>(options);
  const { autoFetch = true } = options;

  const refetch = useCallback(async () => {
    if (!url) return null;
    return apiCall.execute(url);
  }, [url, apiCall]);

  // Auto-fetch on mount if enabled
  useState(() => {
    if (autoFetch && url) {
      void refetch();
    }
  });

  return {
    ...apiCall,
    refetch,
  };
}

/**
 * Hook specifically for POST requests
 */
export function useApiPost<T = unknown, B = unknown>(
  options: UseApiCallOptions = {}
): UseApiCallResult<T> & {
  post: (url: string, body: B) => Promise<T | null>;
} {
  const apiCall = useApiCall<T>(options);

  const post = useCallback(
    async (url: string, body: B) => {
      return apiCall.execute(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    },
    [apiCall]
  );

  return {
    ...apiCall,
    post,
  };
}
