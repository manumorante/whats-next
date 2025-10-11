import type { Task } from '@/lib/types';

const API_URL = '/api/tasks';

export const api = {
  getTasks: async (): Promise<Task[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  createTask: async (title: string): Promise<void> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create task');
  },

  toggleTask: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}?id=${id}`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to toggle task');
  },

  deleteTask: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
  },
};
