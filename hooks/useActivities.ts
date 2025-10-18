'use client';

import useSWR from 'swr';
import type { Activity } from '@/types';
import type { GetActivitiesResponse } from '@/types/api';

const fetcher = async (url: string): Promise<Activity[]> => {
  const response = await fetch(url);
  const data: GetActivitiesResponse = await response.json();
  return data.data;
};

export function useActivities() {
  const { data, error, isLoading } = useSWR<Activity[]>('/api/activities', fetcher);

  return {
    activities: data || [],
    isLoading,
    error,
  };
}
