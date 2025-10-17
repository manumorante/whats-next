import { useState } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import type {
  CreateActivityRequest,
  GetActivitiesFilters,
  UpdateActivityRequest,
} from '@/lib/types';

/**
 * Hook to manage activities with SWR
 * Provides CRUD operations
 */
export function useActivities(filters?: GetActivitiesFilters) {
  const cacheKey = ['activities', filters];

  const { data, error, isLoading, mutate } = useSWR(cacheKey, async () => {
    const params = new URLSearchParams();
    if (filters?.category_id) params.set('category_id', filters.category_id.toString());
    if (filters?.priority) params.set('priority', filters.priority);
    if (filters?.energy_level) params.set('energy_level', filters.energy_level);
    if (filters?.is_completed !== undefined) params.set('is_completed', filters.is_completed.toString());
    
    const response = await fetch(`/api/activities?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch activities');
    return response.json();
  });

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
