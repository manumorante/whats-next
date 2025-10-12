'use client';

import { useEffect, useState } from 'react';
import { ActivityCard } from '@/components/ActivityCard';
import { Loading } from '@/components/Loading';
import { useActivities } from '@/hooks/useActivities';
import { contextsApi } from '@/lib/api';
import type { ContextParsed, GetActivitiesFilters } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AllActivitiesListProps {
  category?: number;
}

export function AllActivitiesList({ category }: AllActivitiesListProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeContexts, setActiveContexts] = useState<ContextParsed[]>([]);
  const [expandedActivityId, setExpandedActivityId] = useState<number | null>(null);

  const filters: GetActivitiesFilters = {
    category_id: category,
    is_completed: showCompleted ? undefined : false,
  };

  const { activities, isLoading, error, toggleActivity, updateActivity, mutatingId } =
    useActivities(filters);

  // Get active contexts for debug info
  useEffect(() => {
    contextsApi.getActive().then(setActiveContexts).catch(console.error);
  }, []);

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
            const hasContexts = activity.contexts && activity.contexts.length > 0;
            const hasTimeSlots = activity.time_slots && activity.time_slots.length > 0;
            const now = new Date();
            const currentTime = now.toTimeString().substring(0, 5);
            const currentDayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

            // Calculate why it's not suggested
            const reasons = [];

            if (!hasContexts && !hasTimeSlots) {
              reasons.push('❌ Sin contextos ni horarios definidos');
            } else {
              // Check context match
              if (hasContexts) {
                const activeContextIds = activeContexts.map((c) => c.id);
                const matchingContexts = activity.contexts?.filter((c) =>
                  activeContextIds.includes(c.id)
                );

                if (matchingContexts && matchingContexts.length > 0) {
                  reasons.push(
                    `✅ Contexto activo: ${matchingContexts.map((c) => c.label).join(', ')}`
                  );
                } else {
                  const contextNames = activity.contexts?.map((c) => c.label).join(', ') || '';
                  reasons.push(`⏸️ Contextos: ${contextNames} (no activos ahora)`);
                }
              }

              // Check time slot match
              if (hasTimeSlots) {
                const matchingSlots = activity.time_slots?.filter((slot) => {
                  const dayMatches = !slot.day_of_week || slot.day_of_week === currentDayName;

                  // Handle time ranges that cross midnight
                  let timeMatches: boolean;
                  if (slot.time_end < slot.time_start) {
                    // Range crosses midnight
                    timeMatches = currentTime >= slot.time_start || currentTime <= slot.time_end;
                  } else {
                    // Normal range
                    timeMatches = currentTime >= slot.time_start && currentTime <= slot.time_end;
                  }

                  return dayMatches && timeMatches;
                });

                if (matchingSlots && matchingSlots.length > 0) {
                  reasons.push(
                    `✅ Horario: ${matchingSlots.map((s) => `${s.time_start}-${s.time_end}`).join(', ')}`
                  );
                } else {
                  const slotInfo =
                    activity.time_slots
                      ?.map((s) => `${s.day_of_week || 'todos'} ${s.time_start}-${s.time_end}`)
                      .join(', ') || '';
                  reasons.push(`⏸️ Horarios: ${slotInfo} (fuera de horario)`);
                }
              }
            }

            if (activity.completions_count && activity.completions_count > 0) {
              reasons.push(`📊 ${activity.completions_count}x completada`);
            }

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
