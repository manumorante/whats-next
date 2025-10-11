'use client';

import type { ActivityWithDetails } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: ActivityWithDetails;
  score?: number;
  reason?: string;
  onComplete?: (id: number) => void;
  onToggle?: (id: number) => void;
  isMutating?: boolean;
}

export function ActivityCard({
  activity,
  score,
  reason,
  onComplete,
  onToggle,
  isMutating = false,
}: ActivityCardProps) {
  const isCompleted = activity.is_completed === 1;
  const isRecurring = activity.is_recurring === 1;

  const energyColors = {
    low: 'text-blue-400 bg-blue-500/10',
    medium: 'text-yellow-400 bg-yellow-500/10',
    high: 'text-red-400 bg-red-500/10',
  };

  const priorityLabels = {
    urgent: 'Must Do',
    important: 'Should Do',
    someday: 'Nice to Have',
  };

  const priorityColors = {
    urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
    important: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    someday: 'bg-neutral-700/50 text-neutral-400 border-neutral-600/20',
  };

  return (
    <details
      className={cn(
        'group relative bg-neutral-900 rounded-lg p-4 border transition-all',
        isCompleted
          ? 'border-neutral-800 opacity-60'
          : 'border-neutral-800 hover:border-neutral-700',
        isMutating && 'opacity-50 pointer-events-none'
      )}
    >
      <summary className="cursor-pointer list-none flex items-start gap-3 [&::-webkit-details-marker]:hidden">
        {/* Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            isRecurring && onComplete ? onComplete(activity.id) : onToggle?.(activity.id);
          }}
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors',
            isCompleted
              ? 'bg-green-500 border-green-500'
              : 'border-neutral-600 hover:border-neutral-500'
          )}
          disabled={isMutating}
        >
          {isCompleted && (
            <svg
              className="w-full h-full text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Completado</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Title */}
        <h3
          className={cn(
            'text-base font-medium flex-1',
            isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-100'
          )}
        >
          {activity.title}
        </h3>
      </summary>

      {/* Category Badge */}
      {activity.category && (
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: `${activity.category.color}20`,
            color: activity.category.color,
          }}
        >
          {activity.category.name}
        </div>
      )}

      {/* Expanded content */}
      <div className="mt-3 ml-8">
        {/* Description */}
        {activity.description && (
          <p className="text-sm text-neutral-400 mb-3">{activity.description}</p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Priority Badge */}
          <span
            className={cn(
              'px-2 py-0.5 text-xs rounded font-medium border',
              priorityColors[activity.priority]
            )}
          >
            {priorityLabels[activity.priority]}
          </span>

          {/* Duration */}
          {activity.duration_minutes && (
            <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded">
              {activity.duration_minutes} min
            </span>
          )}

          {/* Energy Level */}
          {activity.energy_level && (
            <span
              className={cn(
                'px-2 py-0.5 text-xs rounded font-medium',
                energyColors[activity.energy_level]
              )}
            >
              {activity.energy_level === 'low' && 'Low'}
              {activity.energy_level === 'medium' && 'Medium'}
              {activity.energy_level === 'high' && 'High'}
            </span>
          )}

          {/* Location */}
          {activity.location && (
            <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded">
              {activity.location}
            </span>
          )}

          {/* Recurring */}
          {isRecurring && (
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded">
              {activity.recurrence_type}
            </span>
          )}
        </div>

        {/* Contexts */}
        {activity.contexts && activity.contexts.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {activity.contexts.map((context) => (
              <span
                key={context.id}
                className="px-2 py-0.5 bg-neutral-800/50 text-neutral-400 text-xs rounded"
              >
                {context.label}
              </span>
            ))}
          </div>
        )}

        {/* Reason (for suggestions) */}
        {reason && score !== undefined && (
          <div className="mt-2 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">{reason}</p>
              <span className="text-xs font-mono text-neutral-600">{score}pts</span>
            </div>
          </div>
        )}

        {/* Completion stats */}
        {activity.completions_count !== undefined && activity.completions_count > 0 && (
          <p className="text-xs text-neutral-500 mt-2">
            Completada {activity.completions_count}{' '}
            {activity.completions_count === 1 ? 'vez' : 'veces'}
            {activity.last_completed && (
              <> · Última: {new Date(activity.last_completed).toLocaleDateString('es-ES')}</>
            )}
          </p>
        )}
      </div>
    </details>
  );
}
