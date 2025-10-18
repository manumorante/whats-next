'use client';

import useSWR from 'swr';
import type { Activity } from '@/types';

const fetcher = async (url: string): Promise<Activity> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch activity');
  }
  const data = await response.json();
  return data.data;
};

export function useActivity(id: number) {
  const { data, error, isLoading } = useSWR<Activity>(id ? `/api/activities/${id}` : null, fetcher);

  return {
    activity: data,
    isLoading,
    error,
  };
}
