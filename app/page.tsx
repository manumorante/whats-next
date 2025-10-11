'use client';

import { useState, useEffect, useCallback } from 'react';

interface Task {
  id: number;
  title: string;
  completed: number;
  created_at: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask }),
      });

      if (!response.ok) throw new Error('Failed to add task');
      setNewTask('');
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to update task');
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-2">Error: {error}</p>
          <button
            type="button"
            onClick={() => loadTasks()}
            className="text-neutral-500 text-xs hover:text-neutral-300"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-neutral-900 rounded-lg p-6 border border-neutral-800">
        <h1 className="text-base font-semibold text-neutral-100 mb-1">
          What&apos;s Next
        </h1>
        <p className="text-xs text-neutral-500 mb-6">
          Next.js + Turso (SQLite)
        </p>

        {/* Add Task Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nueva tarea..."
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 text-sm font-medium rounded-lg transition-colors"
            >
              Añadir
            </button>
          </div>
        </form>

        {/* Tasks List */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-center text-neutral-600 py-8 text-sm">
              No hay tareas
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-700 hover:bg-neutral-750 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={task.completed === 1}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <span
                  className={`flex-1 text-sm text-neutral-100 ${
                    task.completed === 1 ? 'line-through opacity-50' : ''
                  }`}
                >
                  {task.title}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-xs rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-800 text-center text-neutral-500 text-xs">
            {tasks.filter((t) => t.completed === 0).length} pendientes •{' '}
            {tasks.filter((t) => t.completed === 1).length} completadas
          </div>
        )}
      </div>
    </div>
  );
}
