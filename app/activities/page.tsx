'use client';

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Actividades</h1>

        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            Lista de Actividades
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Aquí se mostrarán todas las actividades disponibles.
          </p>
        </div>
      </main>
    </div>
  );
}
