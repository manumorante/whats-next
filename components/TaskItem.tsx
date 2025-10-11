import { Loading } from '@/components/Loading';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  isLoading?: boolean;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskItem({ task, isLoading, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-neutral-800 p-3 rounded-lg border border-neutral-700',
        'hover:bg-neutral-750 transition-all duration-200',
        isLoading ? 'opacity-60' : 'opacity-100'
      )}
    >
      <div className="relative flex items-center">
        {isLoading ? (
          <Loading />
        ) : (
          <input
            type="checkbox"
            checked={task.completed === 1}
            onChange={() => onToggle(task.id)}
            className="w-4 h-4 rounded cursor-pointer transition-transform hover:scale-110"
          />
        )}
      </div>

      <span
        className={cn(
          'flex-1 text-sm text-neutral-100 transition-all duration-200',
          task.completed === 1 && 'line-through opacity-50'
        )}
      >
        {task.title}
      </span>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        disabled={isLoading}
        className={cn(
          'px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded-lg',
          'transition-all duration-200',
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-600 hover:scale-105'
        )}
      >
        Eliminar
      </button>
    </div>
  );
}
