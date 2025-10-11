import { useState } from 'react';
import useSWR from 'swr';
import { contextsApi } from '@/lib/api';

/**
 * Hook to manage contexts with SWR
 */
export function useContexts() {
  const { data, error, isLoading, mutate } = useSWR('contexts', contextsApi.getAll);

  const [mutatingId, setMutatingId] = useState<number | null>(null);

  /**
   * Create a new context
   */
  const createContext = async (
    name: string,
    label: string,
    days?: string[],
    time_start?: string,
    time_end?: string
  ) => {
    try {
      const result = await contextsApi.create(name, label, days, time_start, time_end);
      await mutate(); // Revalidate
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update a context
   */
  const updateContext = async (
    id: number,
    data: {
      name?: string;
      label?: string;
      days?: string[];
      time_start?: string;
      time_end?: string;
    }
  ) => {
    setMutatingId(id);
    try {
      // Optimistic update
      await mutate(
        (currentData) => {
          if (!currentData) return currentData;

          return currentData.map((context) =>
            context.id === id ? { ...context, ...data } : context
          );
        },
        { revalidate: false }
      );

      await contextsApi.update(id, data);
      await mutate(); // Revalidate
    } catch (error) {
      await mutate(); // Rollback
      throw error;
    } finally {
      setMutatingId(null);
    }
  };

  /**
   * Delete a context
   */
  const deleteContext = async (id: number) => {
    setMutatingId(id);
    try {
      // Optimistic update
      await mutate((currentData) => currentData?.filter((context) => context.id !== id), {
        revalidate: false,
      });

      await contextsApi.delete(id);
      await mutate(); // Revalidate
    } catch (error) {
      await mutate(); // Rollback
      throw error;
    } finally {
      setMutatingId(null);
    }
  };

  return {
    contexts: data ?? [],
    isLoading,
    error: error?.message ?? null,
    mutatingId,
    createContext,
    updateContext,
    deleteContext,
    reload: () => mutate(),
  };
}

/**
 * Hook to get active contexts (for current time)
 */
export function useActiveContexts() {
  const { data, error, isLoading, mutate } = useSWR('contexts:active', contextsApi.getActive, {
    refreshInterval: 60000, // Refresh every minute
  });

  return {
    activeContexts: data ?? [],
    isLoading,
    error: error?.message ?? null,
    reload: () => mutate(),
  };
}
