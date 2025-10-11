import useSWR from 'swr';
import { suggestionsApi } from '@/lib/api';

/**
 * Hook to get activity suggestions for the current time
 * Automatically refreshes every 5 minutes
 */
export function useSuggestions(limit = 10, category?: number) {
  const cacheKey = ['suggestions', limit, category];

  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => suggestionsApi.get(limit, category),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true, // Revalidate when window gets focus
    }
  );

  return {
    suggestions: data ?? [],
    isLoading,
    error: error?.message ?? null,
    reload: () => mutate(),
  };
}
