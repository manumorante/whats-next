import { useState } from 'react';
import useSWR from 'swr';
import type {
  ActivityWithDetails,
  CreateActivityRequest,
  GetActivitiesFilters,
  UpdateActivityRequest,
} from '@/lib/types';

/**
 * Hook to manage activities with SWR
 * Provides CRUD operations
 */
export function useActivities(filters?: GetActivitiesFilters) {
  const params = new URLSearchParams();
  if (filters?.category_id) params.set('category_id', filters.category_id.toString());
  if (filters?.priority) params.set('priority', filters.priority.toString());
  if (filters?.energy) params.set('energy', filters.energy.toString());

  const url = `/api/activities?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<ActivityWithDetails[]>(
    url,
    async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch activities');
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

  const [mutatingId, setMutatingId] = useState<number | null>(null);

  /**
   * Create a new activity
   */
  const createActivity = async (data: CreateActivityRequest) => {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create activity');
    await mutate();
    return response.json();
  };

  /**
   * Update an existing activity
   */
  const updateActivity = async (id: number, data: UpdateActivityRequest) => {
    setMutatingId(id);
    try {
      const response = await fetch(`/api/activities?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update activity');
      await mutate();
    } finally {
      setMutatingId(null);
    }
  };

  /**
   * Delete an activity
   */
  const deleteActivity = async (id: number) => {
    setMutatingId(id);
    try {
      const response = await fetch(`/api/activities?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete activity');
      await mutate();
    } finally {
      setMutatingId(null);
    }
  };

  /**
   * Toggle activity completion
   */
  const toggleActivity = async (id: number) => {
    setMutatingId(id);
    try {
      const response = await fetch(`/api/activities/${id}/toggle`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to toggle activity');
      await mutate();
    } finally {
      setMutatingId(null);
    }
  };

  return {
    activities: data ?? [],
    isLoading,
    error: error?.message ?? null,
    mutatingId,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivity,
    reload: () => mutate(),
  };
}
