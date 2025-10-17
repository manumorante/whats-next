import useSWR from 'swr';
import type { ActivityScore } from '@/services/suggestions';

export function useScoredActivities() {
  const url = '/api/suggestions';

  const { data, error, isLoading, mutate } = useSWR<ActivityScore[]>(
    url,
    async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch scored activities');
      return response.json();
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
      refreshInterval: 0,
    }
  );

  return {
    scoredActivities: data ?? [],
    isLoading,
    error: error?.message ?? null,
    reload: () => mutate(),
  };
}
