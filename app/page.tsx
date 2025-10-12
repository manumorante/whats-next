'use client';

import { useState } from 'react';
import { AllActivitiesList } from '@/components/AllActivitiesList';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CurrentTimeInfo } from '@/components/CurrentTimeInfo';
import { QuickAddActivity } from '@/components/QuickAddActivity';
import { SuggestionsList } from '@/components/SuggestionsList';
import { useActivities } from '@/hooks/useActivities';
import { cn } from '@/lib/utils';

type ViewMode = 'suggestions' | 'all';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('suggestions');
  const { createActivity } = useActivities();

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">¿Qué sigue?</h1>
          <p className="text-neutral-400 text-sm">
            Actividades inteligentes según tu momento del día
          </p>
        </header>

        {/* Current Time & Contexts */}
        <CurrentTimeInfo />

        {/* Quick Add */}
        <QuickAddActivity
          onAdd={async (title, suggestedData) => {
            await createActivity({
              title,
              ...suggestedData,
            });
          }}
        />

        {/* View Mode Toggle */}
        <div className="mb-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('suggestions')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              viewMode === 'suggestions'
                ? 'bg-neutral-800 text-neutral-100'
                : 'bg-transparent text-neutral-500 hover:text-neutral-300'
            )}
          >
            Sugerencias
          </button>
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              viewMode === 'all'
                ? 'bg-neutral-800 text-neutral-100'
                : 'bg-transparent text-neutral-500 hover:text-neutral-300'
            )}
          >
            Todas las actividades
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Content based on view mode */}
        {viewMode === 'suggestions' ? (
          <SuggestionsList limit={10} category={selectedCategory} />
        ) : (
          <AllActivitiesList category={selectedCategory} />
        )}

        {/* Footer hint */}
        {viewMode === 'suggestions' && (
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-600">
              Las sugerencias se actualizan automáticamente cada 5 minutos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
