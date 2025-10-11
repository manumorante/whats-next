import { TaskItem } from '@/components/TaskItem';
import type { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  mutatingId: number | null;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskList({ tasks, mutatingId, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-center text-neutral-600 py-8 text-sm">No hay tareas</p>;
  }

  const pending = tasks.filter((t) => t.completed === 0).length;
  const completed = tasks.filter((t) => t.completed === 1).length;

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isLoading={mutatingId === task.id}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-800 text-center text-neutral-500 text-xs">
        {pending} pendientes • {completed} completadas
      </div>
    </>
  );
}
