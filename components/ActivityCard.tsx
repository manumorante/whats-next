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
        'bg-white border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700'
      )}
    >
      {/* Title */}
      <div>
        <Link href={`/activity/${activity.id}`}>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {activity.title}
          </h3>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category */}
        <div>
          <span className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Categoría
          </span>
          <span className="text-sm text-neutral-900 dark:text-neutral-100">
            {getCategoryName()}
          </span>
        </div>

        {/* Priority */}
        <div>
          <span className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Prioridad
          </span>
          <span className="text-sm text-neutral-900 dark:text-neutral-100">
            {getPriorityLabel()}
          </span>
        </div>

        {/* Energy */}
        <div>
          <span className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            Energía
          </span>
          <span className="text-sm text-neutral-900 dark:text-neutral-100">{getEnergyLabel()}</span>
        </div>
      </div>

      {/* Contexts */}
      <div>
        <span className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
          Contextos
        </span>
        <div className="flex flex-wrap gap-2">
          {activity.contexts && activity.contexts.length > 0 ? (
            activity.contexts.map((context) => (
              <span
                key={context.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {context.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Sin contextos asignados
            </span>
          )}
        </div>
      </div>

      {/* Score */}
      {score !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Puntuación
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{score} puntos</span>
        </div>
      )}

      {/* Reasons (for suggestions) */}
      {reasons && reasons.length > 0 && score !== undefined && (
        <div>
          <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Razones de Sugerencia
          </span>
          <div className="space-y-1">
            {reasons.map((reason, index) => (
              <p
                key={index}
                className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 p-2 rounded"
              >
                {reason}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
