import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ScoredActivity } from '@/types';
import { CATEGORY_OPTIONS, ENERGY_OPTIONS, PRIORITY_OPTIONS } from '@/types/constants';

export function ActivityCard({ activity, score, reasons }: ScoredActivity) {
  // Helper functions to get display values
  const getCategoryName = () => {
    return (
      CATEGORY_OPTIONS.find((option) => option.value === activity.category)?.label || 'General'
    );
  };

  const getPriorityLabel = () => {
    return (
      PRIORITY_OPTIONS.find((option) => option.value === activity.priority)?.label ||
      'Sin prioridad'
    );
  };

  const getEnergyLabel = () => {
    return (
      ENERGY_OPTIONS.find((option) => option.value === activity.energy)?.label || 'Sin energía'
    );
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 space-y-4',
        'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700'
      )}
    >
      {/* Title */}
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors cursor-pointer">
          {activity.title}
        </h3>

        <Link
          className="text-base text-zinc-600 dark:text-zinc-400"
          href={`/activity/${activity.id}`}
        >
          Editar
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        {/* Category */}
        <div>
          <span className="text-base text-zinc-900 dark:text-zinc-100">{getCategoryName()}</span>
        </div>

        {/* Priority */}
        <div>
          <span className="text-base text-zinc-900 dark:text-zinc-100">{getPriorityLabel()}</span>
        </div>

        {/* Energy */}
        <div>
          <span className="text-base text-zinc-900 dark:text-zinc-100">{getEnergyLabel()}</span>
        </div>
      </div>

      {/* Contexts */}
      <div>
        <span className="block text-base font-medium text-zinc-600 dark:text-zinc-400 mb-2">
          Contextos
        </span>
        <div className="flex flex-wrap gap-2">
          {activity.contexts && activity.contexts.length > 0 ? (
            activity.contexts.map((context) => (
              <span
                key={context.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                {context.name}
              </span>
            ))
          ) : (
            <span className="text-base text-zinc-500 dark:text-zinc-400">
              Sin contextos asignados
            </span>
          )}
        </div>
      </div>

      {/* Reasons (for suggestions) */}
      {reasons && reasons.length > 0 && score !== undefined && (
        <div>
          <div className="space-y-1">
            {reasons.map((reason, index) => (
              <p key={index} className="text-base text-zinc-600 dark:text-zinc-400">
                {reason}
              </p>
            ))}
          </div>

          <span className="text-base font-bold text-zinc-600 dark:text-zinc-400">
            {score} puntos
          </span>
        </div>
      )}
    </div>
  );
}
