'use client';

import { type FormEvent, use } from 'react';
import { Loading } from '@/components/Loading';
import { useActivity } from '@/hooks/useActivity';
import { useAllContexts } from '@/hooks/useAllContexts';
import { CATEGORY_OPTIONS, ENERGY_OPTIONS, PRIORITY_OPTIONS } from '@/types/constants';

interface ActivityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const resolvedParams = use(params);
  const { activity, isLoading, error } = useActivity(Number(resolvedParams.id));
  const {
    contexts: allContexts,
    isLoading: contextsLoading,
    error: contextsError,
  } = useAllContexts();

  // Función para manejar el envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Log de datos raw del FormData
    console.log('=== DATOS DEL FORMULARIO ===');
    console.log('FormData raw:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Log de datos procesados
    const data = {
      category: Number(formData.get('category')),
      energy: Number(formData.get('energy')),
      priority: Number(formData.get('priority')),
      contexts: Array.from(formData.getAll('contexts')).map(Number),
    };

    console.log('Datos procesados:', data);
    console.log('============================');
  };

  if (isLoading || contextsLoading) {
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
          <p>Error al cargar la actividad: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-4 px-6 pb-20 pt-8">
        <div className="text-center py-8 text-neutral-500">
          <p className="text-lg">Actividad no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-4 px-6 pb-20 pt-8">
      <header className="flex flex-col">
        <h1 className="text-4xl font-bold text-black dark:text-neutral-200">{activity.title}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4">
          <h2 className="text-lg font-semibold mb-4">Editar Actividad</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Categoría:</strong>
              <select
                name="category"
                defaultValue={activity.category}
                className="ml-2 px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 text-sm"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <strong>Energía:</strong>
              <select
                name="energy"
                defaultValue={activity.energy}
                className="ml-2 px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 text-sm"
              >
                {ENERGY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <strong>Prioridad:</strong>
              <select
                name="priority"
                defaultValue={activity.priority}
                className="ml-2 px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 text-sm"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4">
          <h2 className="text-lg font-semibold mb-2">Contextos</h2>
          <div className="space-y-3">
            {allContexts.map((context) => (
              <div key={context.id} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={`context-${context.id}`}
                  name="contexts"
                  value={context.id}
                  defaultChecked={activity.contexts?.some((ctx) => ctx.id === context.id)}
                  className="mt-1 h-4 w-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`context-${context.id}`}
                    className="text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                  >
                    {context.label}
                  </label>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    {context.days && <p>Días: {context.days.join(', ')}</p>}
                    {context.time_start && context.time_end && (
                      <p>
                        Horario: {context.time_start} - {context.time_end}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {allContexts.length === 0 && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No hay contextos disponibles
              </p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
