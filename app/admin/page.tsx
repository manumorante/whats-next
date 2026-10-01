'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useActivities } from '@/hooks/useActivities';
import { useAllContexts } from '@/hooks/useAllContexts';

type Tab = 'contexts' | 'activities';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('contexts');
  const { contexts, isLoading: contextsLoading } = useAllContexts();
  const { activities, isLoading: activitiesLoading } = useActivities();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Administración</h1>

        {/* Navegación por pestañas */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('contexts')}
              className={`flex-1 py-3 px-4 text-base font-medium rounded-md transition-colors ${
                activeTab === 'contexts'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Contextos ({contexts.length})
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex-1 py-3 px-4 text-base font-medium rounded-md transition-colors ${
                activeTab === 'activities'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Actividades ({activities.length})
            </button>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === 'contexts' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
                Contextos
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6">
                Total: {contexts.length} contextos
              </p>
              <Link
                href="/contexts"
                className="inline-block px-6 py-3 bg-zinc-600 text-white text-lg font-medium rounded-lg hover:bg-zinc-700 active:bg-zinc-800 transition-colors"
              >
                Gestionar Contextos
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
                Actividades
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6">
                Total: {activities.length} actividades
              </p>
              <Link
                href="/activities"
                className="inline-block px-6 py-3 bg-zinc-600 text-white text-lg font-medium rounded-lg hover:bg-zinc-700 active:bg-zinc-800 transition-colors"
              >
                Gestionar Actividades
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
