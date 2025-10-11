'use client';

import { useActivities } from '@/hooks/useActivities';
import { useSuggestions } from '@/hooks/useSuggestions';
import { ActivityCard } from './ActivityCard';
import { Loading } from './Loading';

interface SuggestionsListProps {
  limit?: number;
  category?: number;
}

export function SuggestionsList({ limit = 10, category }: SuggestionsListProps) {
  const { suggestions, isLoading, error, reload } = useSuggestions(limit, category);
  const { completeActivity, toggleActivity, mutatingId } = useActivities();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 text-sm mb-2">Error: {error}</p>
        <button
          type="button"
          onClick={() => reload()}
          className="text-neutral-500 text-xs hover:text-neutral-300"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400 text-sm mb-2">
          No hay actividades sugeridas para este momento
        </p>
        <p className="text-neutral-500 text-xs">
          Intenta agregar actividades con contextos o horarios específicos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => (
        <ActivityCard
          key={suggestion.activity.id}
          activity={suggestion.activity}
          score={suggestion.score}
          reason={suggestion.reason}
          onComplete={completeActivity}
          onToggle={toggleActivity}
          isMutating={mutatingId === suggestion.activity.id}
        />
      ))}
    </div>
  );
}
