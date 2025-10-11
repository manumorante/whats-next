'use client';

import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { useTasks } from '@/hooks/useTasks';

export default function Home() {
  const { tasks, isLoading, error, mutatingId, addTask, toggleTask, deleteTask, reload } =
    useTasks();

  if (isLoading) {
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
            onClick={() => reload()}
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
        <h1 className="text-base font-semibold text-neutral-100 mb-1">What&apos;s Next</h1>
        <p className="text-xs text-neutral-500 mb-6">Next.js + Turso (SQLite)</p>

        <TaskForm onSubmit={addTask} />
        <TaskList
          tasks={tasks}
          mutatingId={mutatingId}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}
