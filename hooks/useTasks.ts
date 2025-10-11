import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';

export function useTasks() {
  const { data, error, isLoading, mutate } = useSWR('tasks', api.getTasks);
  const [mutatingId, setMutatingId] = useState<number | null>(null);

  const addTask = async (title: string) => {
    await api.createTask(title);
    mutate();
  };

  const toggleTask = async (id: number) => {
    setMutatingId(id);
    try {
      await api.toggleTask(id);
      await mutate();
    } finally {
      setMutatingId(null);
    }
  };

  const deleteTask = async (id: number) => {
    setMutatingId(id);
    try {
      await api.deleteTask(id);
      await mutate();
    } finally {
      setMutatingId(null);
    }
  };

  return {
    tasks: data ?? [],
    isLoading,
    error: error?.message ?? null,
    mutatingId,
    addTask,
    toggleTask,
    deleteTask,
    reload: () => mutate(),
  };
}
