import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (title: string) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSubmit(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
  );
}
