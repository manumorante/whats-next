'use client';

import { ActivityCard } from '@/components/ActivityCard';
import { Loading } from '@/components/Loading';
import { useActiveContexts } from '@/hooks/useActiveContexts';
import { useActivities } from '@/hooks/useActivities';
import { calculateActivityScore } from '@/lib/scoring';
import type { Activity, ScoredActivity } from '@/types';

export default function Home() {
  const currentTime = new Date();
  const dayName = currentTime.toLocaleDateString('es-ES', { weekday: 'short' });

  const { contexts, isLoading: contextsLoading, error: contextsError } = useActiveContexts();
  const { activities, isLoading: activitiesLoading, error: activitiesError } = useActivities();

  const isLoading = contextsLoading || activitiesLoading;
  const error = contextsError || activitiesError;

  // Calculate scored activities when both data are available
  const scoredActivities =
    activities.length > 0
      ? activities
          .map((activity: Activity) => calculateActivityScore(activity, contexts))
          .sort((a: ScoredActivity, b: ScoredActivity) => (b.score || 0) - (a.score || 0))
      : [];

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-4 px-6 pb-20 pt-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-4 px-6 pb-20 pt-8">
        <div className="text-center py-8 text-red-500">
          <p>Error al cargar datos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-4 px-6 pb-20 pt-8">
      {/* Hero */}
      <header className="flex flex-col">
        <div className="tracking-tight text-6xl capitalize text-black dark:text-neutral-200 leading-none font-black">
          {dayName}
        </div>
        <div className="text-5xl font-extralight text-neutral-400">
          {contexts.map((context) => context.label).join(', ')}
        </div>
      </header>

      {/* Activities List - Ordered by Score */}
      <section className="space-y-4">
        {!scoredActivities.length ? (
          <div className="text-center py-12 text-neutral-500">
            <p className="text-lg mb-2">No hay actividades</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scoredActivities.map((scoredActivity: ScoredActivity) => (
              <ActivityCard
                key={scoredActivity.activity.id}
                activity={scoredActivity.activity}
                score={scoredActivity.score}
                reasons={scoredActivity.reasons}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="mt-auto text-center text-xs text-neutral-500 dark:text-neutral-500">
        Las actividades se ordenan por puntuación automáticamente
      </footer>
    </div>
  );
}
