'use client';

import { useState } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CurrentTimeInfo } from '@/components/CurrentTimeInfo';
import { QuickAddActivity } from '@/components/QuickAddActivity';
import { SuggestionsList } from '@/components/SuggestionsList';
import { useActivities } from '@/hooks/useActivities';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const { createActivity } = useActivities();

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">What&apos;s Next?</h1>
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

        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Suggestions Section */}
        <SuggestionsList limit={10} category={selectedCategory} />

        {/* Footer hint */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-600">
            Las sugerencias se actualizan automáticamente cada 5 minutos
          </p>
        </div>
      </div>
    </div>
  );
}
