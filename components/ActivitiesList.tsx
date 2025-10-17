'use client';

import { ActivityCard } from '@/components/ActivityCard';
import { Loading } from '@/components/Loading';
import { useScoredActivities } from '@/hooks/useScoredActivities';

export function ActivitiesList() {
  const { scoredActivities, isLoading, error } = useScoredActivities();

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

  if (!scoredActivities.length) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p className="text-lg mb-2">No hay actividades</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scoredActivities.map(({ activity, score }) => (
        <ActivityCard key={activity.id} activity={activity} score={score} />
      ))}
    </div>
  );
}
