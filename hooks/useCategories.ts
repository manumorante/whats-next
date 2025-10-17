import { useState } from 'react';
import useSWR from 'swr';
import type { Category } from '@/lib/types';

/**
 * Hook to manage categories with SWR
 */
export function useCategories() {
  const url = '/api/categories';

  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    url,
    async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch categories');
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
   * Create a new category
   */
  const createCategory = async (name: string, color: string, icon?: string) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color, icon }),
    });
    if (!response.ok) throw new Error('Failed to create category');
    await mutate();
    return response.json();
  };

  /**
   * Update a category
   */
  const updateCategory = async (
    id: number,
    data: { name?: string; color?: string; icon?: string }
  ) => {
    setMutatingId(id);
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update category');
      await mutate();
    } finally {
      setMutatingId(null);
    }
  };

  /**
   * Delete a category
   */
  const deleteCategory = async (id: number) => {
    setMutatingId(id);
    try {
      const response = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete category');
      await mutate();
    } finally {
      setMutatingId(null);
    }
  };

  return {
    categories: data ?? [],
    isLoading,
    error: error?.message ?? null,
    mutatingId,
    createCategory,
    updateCategory,
    deleteCategory,
    reload: () => mutate(),
  };
}
