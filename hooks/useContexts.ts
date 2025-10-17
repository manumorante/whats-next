import { useState } from 'react';
import useSWR from 'swr';
import type { ContextParsed } from '@/lib/types';

/**
 * Hook to manage contexts with SWR
 */
export function useContexts() {
  const { data, error, isLoading, mutate } = useSWR<ContextParsed[]>('contexts', async () => {
    const response = await fetch('/api/contexts');
    if (!response.ok) throw new Error('Failed to fetch contexts');
    return response.json();
  });

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
    const response = await fetch('/api/contexts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, label, days, time_start, time_end }),
    });
    if (!response.ok) throw new Error('Failed to create context');
    await mutate();
    return response.json();
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
      const response = await fetch(`/api/contexts?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update context');
      await mutate();
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
      const response = await fetch(`/api/contexts?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete context');
      await mutate();
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
  const { data, error, isLoading, mutate } = useSWR<ContextParsed[]>(
    'contexts:active',
    async () => {
      const response = await fetch('/api/contexts?active=true');
      if (!response.ok) throw new Error('Failed to fetch active contexts');
      return response.json();
    },
    {
      refreshInterval: 60000, // Refresh every minute
    }
  );

  return {
    activeContexts: data ?? [],
    isLoading,
    error: error?.message ?? null,
    reload: () => mutate(),
  };
}
