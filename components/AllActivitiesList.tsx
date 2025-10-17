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

interface AllActivitiesListProps {
  category?: number;
}

export function AllActivitiesList({ category }: AllActivitiesListProps) {
  const [expandedActivityId, setExpandedActivityId] = useState<number | null>(null);

  const filters: GetActivitiesFilters = {
    category_id: category,
    is_completed: false,
  };

  const { activities, isLoading, error, updateActivity, mutatingId } = useActivities(filters);
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

  const now = new Date();

  return (
    <div className="space-y-4">
      {/* Lista de actividades */}
      <div className="space-y-3">
        {activities.map((activity) => {
          const reasons = describeActivityStatus(activity, activeContexts, now);
          const isExpanded = expandedActivityId === activity.id;

          return (
            <div key={activity.id} className="space-y-1">
              <ActivityCard
                activity={activity}
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
                  <div className="flex-1 text-xs text-neutral-500 dark:text-neutral-400 space-y-0.5">
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
