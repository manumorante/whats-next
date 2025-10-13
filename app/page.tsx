'use client';

import { useState } from 'react';
import { AllActivitiesList } from '@/components/AllActivitiesList';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CurrentTimeInfo } from '@/components/CurrentTimeInfo';
import { QuickAddActivity } from '@/components/QuickAddActivity';
import { SuggestionsList } from '@/components/SuggestionsList';
import { useActivities } from '@/hooks/useActivities';

type ViewMode = 'suggestions' | 'all';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('suggestions');
  const { createActivity } = useActivities();

  return (
    <div className="min-h-[100svh] bg-neutral-50 transition-colors duration-300 dark:bg-neutral-950">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-4 px-6 pb-20 pt-8">
        {/* Hero */}
        <header className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <h1 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              What's Next?
            </h1>
          </div>

          <CurrentTimeInfo />
        </header>

        {/* Quick Add */}
        <section className="space-y-4">
          <QuickAddActivity
            onAdd={async (title, suggestedData) => {
              await createActivity({
                title,
                ...suggestedData,
              });
            }}
          />
        </section>

        {/* Primary suggestion */}
        <section className="space-y-6">
          <SuggestionsList limit={1} />
        </section>

        {/* Secondary content */}
        <section className="space-y-4">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'suggestions' ? 'all' : 'suggestions')}
            className="w-full rounded-3xl border border-neutral-200 px-6 py-4 text-base font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-neutral-100"
          >
            {viewMode === 'suggestions' ? 'Todas todas' : 'Ocultar todas'}
          </button>

          {viewMode === 'all' && (
            <>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <AllActivitiesList category={selectedCategory} />
            </>
          )}
        </section>

        <footer className="mt-auto text-center text-xs text-neutral-500 dark:text-neutral-500">
          Las sugerencias se actualizan automáticamente cada 5 minutos
        </footer>
      </div>
    </div>
  );
}
