import useSWR from 'swr';
import type { ActivitySuggestion } from '@/lib/types';

/**
 * Hook to get activity suggestions for the current time
 */
export function useSuggestions(limit = 10, category?: number) {
  const cacheKey = ['suggestions', limit, category];

  const { data, error, isLoading, mutate } = useSWR<ActivitySuggestion[]>(
    cacheKey,
    async () => {
      const params = new URLSearchParams();
      params.set('limit', limit.toString());
      if (category) params.set('category', category.toString());

      const response = await fetch(`/api/suggestions?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      return response.json();
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
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
