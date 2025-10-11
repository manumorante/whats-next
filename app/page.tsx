'use client';

import { useState } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CurrentTimeInfo } from '@/components/CurrentTimeInfo';
import { SuggestionsList } from '@/components/SuggestionsList';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

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

        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Suggestions Section */}
        <section className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-100">Sugerencias para ti</h2>
            <span className="text-xs text-neutral-500">Basadas en tu tiempo y preferencias</span>
          </div>

          <SuggestionsList limit={10} category={selectedCategory} />
        </section>

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
