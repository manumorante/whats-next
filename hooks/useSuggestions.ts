import useSWR from 'swr';
import type { ActivitySuggestion } from '@/lib/types';

/**
 * Hook to get activity suggestions for the current time
 */
export function useSuggestions(limit = 10, category?: number) {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (category) params.set('category', category.toString());

  const url = `/api/suggestions?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<ActivitySuggestion[]>(
    url,
    async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      return response.json();
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0, // No deduplication
      refreshInterval: 0, // No automatic refresh
    }
  );

  return {
    suggestions: data ?? [],
    isLoading,
    error: error?.message ?? null,
    reload: () => mutate(),
  };
}
