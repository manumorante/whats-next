import { useState } from 'react';
import useSWR from 'swr';
import { activitiesApi } from '@/lib/api';
import type {
  CreateActivityRequest,
  GetActivitiesFilters,
  UpdateActivityRequest,
} from '@/lib/types';

/**
 * Hook to manage activities with SWR
 * Provides CRUD operations with optimistic updates
 */
export function useActivities(filters?: GetActivitiesFilters) {
  const cacheKey = ['activities', filters];

  const { data, error, isLoading, mutate } = useSWR(cacheKey, () => activitiesApi.getAll(filters));

  const [mutatingId, setMutatingId] = useState<number | null>(null);

  /**
   * Create a new activity
   */
  const createActivity = async (data: CreateActivityRequest) => {
    try {
      const result = await activitiesApi.create(data);
      await mutate(); // Revalidate data
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update an existing activity
   */
  const updateActivity = async (id: number, data: UpdateActivityRequest) => {
    setMutatingId(id);
    try {
      await activitiesApi.update(id, data);
      await mutate(); // Revalidate to get server data
    } catch (error) {
      await mutate(); // Rollback on error
      throw error;
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
      // Optimistic update
      await mutate((currentData) => currentData?.filter((activity) => activity.id !== id), {
        revalidate: false,
      });

      await activitiesApi.delete(id);
      await mutate(); // Revalidate
    } catch (error) {
      await mutate(); // Rollback on error
      throw error;
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
      // Optimistic update
      await mutate(
        (currentData) => {
          if (!currentData) return currentData;

          return currentData.map((activity) =>
            activity.id === id
              ? { ...activity, is_completed: activity.is_completed === 1 ? 0 : 1 }
              : activity
          );
        },
        { revalidate: false }
      );

      await activitiesApi.toggle(id);
      await mutate(); // Revalidate
    } catch (error) {
      await mutate(); // Rollback on error
      throw error;
    } finally {
      setMutatingId(null);
    }
  };

  /**
   * Mark recurring activity as completed
   */
  const completeActivity = async (id: number, notes?: string) => {
    setMutatingId(id);
    try {
      await activitiesApi.complete(id, notes);
      await mutate(); // Revalidate to update completion count
    } catch (error) {
      throw error;
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
    completeActivity,
    reload: () => mutate(),
  };
}
