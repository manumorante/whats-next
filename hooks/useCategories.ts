import { useState } from 'react';
import useSWR from 'swr';
import { categoriesApi } from '@/lib/api';

/**
 * Hook to manage categories with SWR
 */
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR('categories', categoriesApi.getAll);

  const [mutatingId, setMutatingId] = useState<number | null>(null);

  /**
   * Create a new category
   */
  const createCategory = async (name: string, color: string, icon?: string) => {
    const result = await categoriesApi.create(name, color, icon);
    await mutate(); // Revalidate
    return result;
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
      // Optimistic update
      await mutate(
        (currentData) => {
          if (!currentData) return currentData;

          return currentData.map((category) =>
            category.id === id ? { ...category, ...data } : category
          );
        },
        { revalidate: false }
      );

      await categoriesApi.update(id, data);
      await mutate(); // Revalidate
    } catch (error) {
      await mutate(); // Rollback
      throw error;
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
      // Optimistic update
      await mutate((currentData) => currentData?.filter((category) => category.id !== id), {
        revalidate: false,
      });

      await categoriesApi.delete(id);
      await mutate(); // Revalidate
    } catch (error) {
      await mutate(); // Rollback
      throw error;
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
