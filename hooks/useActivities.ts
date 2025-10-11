import { useState } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
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
   * Update an existing activity with optimistic update
   */
  const updateActivity = async (id: number, data: UpdateActivityRequest) => {
    setMutatingId(id);
    try {
      // Optimistic update for activities cache
      await mutate(
        (currentData) => {
          if (!currentData) return currentData;
          return currentData.map((activity) => {
            if (activity.id !== id) return activity;

            // Only update simple fields, skip complex relations
            const updated = { ...activity };
            if (data.title !== undefined) updated.title = data.title;
            if (data.description !== undefined) updated.description = data.description;
            if (data.category_id !== undefined) updated.category_id = data.category_id;
            if (data.priority !== undefined) updated.priority = data.priority;
            if (data.energy_level !== undefined) updated.energy_level = data.energy_level;
            if (data.is_recurring !== undefined) updated.is_recurring = data.is_recurring ? 1 : 0;
            if (data.recurrence_type !== undefined) updated.recurrence_type = data.recurrence_type;

            return updated;
          });
        },
        { revalidate: false }
      );

      // Call API
      await activitiesApi.update(id, data);

      // Revalidate activities cache
      await mutate();

      // Also revalidate suggestions cache globally (they depend on activities)
      await globalMutate((key) => Array.isArray(key) && key[0] === 'suggestions');
    } catch (error) {
      await mutate(); // Rollback on error
      await globalMutate((key) => Array.isArray(key) && key[0] === 'suggestions');
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
