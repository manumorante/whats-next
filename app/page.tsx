'use client';

import { ActiveContextsInfo } from '@/components/ActiveContextsInfo';
import { ActivitiesList } from '@/components/ActivitiesList';

export default function Home() {
  const currentTime = new Date();
  const dayName = currentTime.toLocaleDateString('es-ES', { weekday: 'short' });

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-4 px-6 pb-20 pt-8">
      {/* Hero */}
      <header className="flex flex-col">
        <div className="tracking-tight text-6xl capitalize text-black dark:text-neutral-200 leading-none font-black">
          {dayName}
        </div>
        <div className="text-5xl font-extralight text-neutral-400">
          <ActiveContextsInfo />
        </div>
      </header>

      {/* Activities List - Ordered by Score */}
      <section className="space-y-4">
        <ActivitiesList />
      </section>

      <footer className="mt-auto text-center text-xs text-neutral-500 dark:text-neutral-500">
        Las actividades se ordenan por puntuación automáticamente
      </footer>
    </div>
  );
}
