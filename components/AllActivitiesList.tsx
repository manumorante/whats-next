'use client';

import { useState } from 'react';
import { ActivityCard } from '@/components/ActivityCard';
import { Loading } from '@/components/Loading';
import { useActivities } from '@/hooks/useActivities';
import { useActiveContexts } from '@/hooks/useContexts';
import type {
  ActivityTimeSlot,
  ActivityWithDetails,
  ContextParsed,
  GetActivitiesFilters,
} from '@/lib/types';
import { cn } from '@/lib/utils';

interface AllActivitiesListProps {
  category?: number;
}

export function AllActivitiesList({ category }: AllActivitiesListProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedActivityId, setExpandedActivityId] = useState<number | null>(null);

  const filters: GetActivitiesFilters = {
    category_id: category,
    is_completed: showCompleted ? undefined : false,
  };

  const { activities, isLoading, error, toggleActivity, updateActivity, mutatingId } =
    useActivities(filters);
  const { activeContexts } = useActiveContexts();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-neutral-400">
        <p>Error al cargar actividades: {error}</p>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p className="text-lg mb-2">No hay actividades</p>
        <p className="text-sm">Crea tu primera actividad para empezar</p>
      </div>
    );
  }

  // Agrupar actividades por estado
  const activeActivities = activities.filter((a) => a.is_completed === 0);
  const completedActivities = activities.filter((a) => a.is_completed === 1);
  const now = new Date();

  return (
    <div className="space-y-4">
      {/* Toggle para mostrar completadas */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          {activeActivities.length} activa{activeActivities.length !== 1 ? 's' : ''}
          {completedActivities.length > 0 &&
            ` · ${completedActivities.length} completada${completedActivities.length !== 1 ? 's' : ''}`}
        </div>

        <button
          type="button"
          onClick={() => setShowCompleted(!showCompleted)}
          className={cn(
            'px-3 py-1 text-xs rounded-full transition-all',
            showCompleted
              ? 'bg-neutral-700 text-neutral-200'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          )}
        >
          {showCompleted ? 'Ocultar completadas' : 'Mostrar completadas'}
        </button>
      </div>

      {/* Lista de actividades activas */}
      {activeActivities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-300">
            Activas
            {activeContexts.length > 0 && (
              <span className="ml-2 text-xs text-neutral-500 font-normal">
                Contextos activos ahora: {activeContexts.map((c) => c.label).join(', ')}
              </span>
            )}
          </h3>
          {activeActivities.map((activity) => {
            const reasons = describeActivityStatus(activity, activeContexts, now);
            const isExpanded = expandedActivityId === activity.id;

            return (
              <div key={activity.id} className="space-y-1">
                <ActivityCard
                  activity={activity}
                  onToggle={toggleActivity}
                  onUpdate={updateActivity}
                  isMutating={mutatingId === activity.id}
                />
                <div className="pl-4 flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedActivityId(isExpanded ? null : activity.id)}
                    className="text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
                  >
                    {isExpanded ? '▼' : '▶'} Debug
                  </button>
                  {isExpanded && (
                    <div className="flex-1 text-xs text-neutral-600 space-y-0.5">
                      {reasons.map((reason) => (
                        <div key={reason}>{reason}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista de actividades completadas (si están visibles) */}
      {showCompleted && completedActivities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-500">Completadas</h3>
          {completedActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onToggle={toggleActivity}
              onUpdate={updateActivity}
              isMutating={mutatingId === activity.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function describeActivityStatus(
  activity: ActivityWithDetails,
  activeContexts: ContextParsed[],
  now: Date
) {
  const reasons: string[] = [];
  const hasContexts = Boolean(activity.contexts?.length);
  const hasTimeSlots = Boolean(activity.time_slots?.length);

  if (!hasContexts && !hasTimeSlots) {
    reasons.push('❌ Sin contextos ni horarios definidos');
  } else {
    if (hasContexts) {
      const activeIds = new Set(activeContexts.map((context) => context.id));
      const matchingContexts = activity.contexts?.filter((context) => activeIds.has(context.id));

      if (matchingContexts?.length) {
        reasons.push(`✅ Contexto activo: ${matchingContexts.map((c) => c.label).join(', ')}`);
      } else {
        const contextNames = activity.contexts?.map((c) => c.label).join(', ') || '';
        reasons.push(`⏸️ Contextos: ${contextNames} (no activos ahora)`);
      }
    }

    if (hasTimeSlots) {
      const { currentTime, currentDayName } = getCurrentTimeInfo(now);
      const matchingSlots = activity.time_slots?.filter((slot) => {
        const dayMatches = !slot.day_of_week || slot.day_of_week === currentDayName;
        const crossesMidnight = slot.time_end < slot.time_start;

        if (!dayMatches) {
          return false;
        }

        if (crossesMidnight) {
          return currentTime >= slot.time_start || currentTime <= slot.time_end;
        }

        return currentTime >= slot.time_start && currentTime <= slot.time_end;
      });

      if (matchingSlots?.length) {
        reasons.push(`✅ Horario: ${matchingSlots.map(formatSlot).join(', ')}`);
      } else {
        const slotInfo =
          activity.time_slots
            ?.map((slot) => `${slot.day_of_week || 'todos'} ${formatSlot(slot)}`)
            .join(', ') || '';
        reasons.push(`⏸️ Horarios: ${slotInfo} (fuera de horario)`);
      }
    }
  }

  if (activity.completions_count && activity.completions_count > 0) {
    reasons.push(`📊 ${activity.completions_count}x completada`);
  }

  return reasons;
}

function getCurrentTimeInfo(now: Date) {
  return {
    currentTime: now.toTimeString().substring(0, 5),
    currentDayName: DAY_NAMES[now.getDay()],
  };
}

function formatSlot(slot: ActivityTimeSlot) {
  return `${slot.time_start}-${slot.time_end}`;
}
