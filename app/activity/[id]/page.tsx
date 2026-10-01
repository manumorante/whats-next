'use client';

import Link from 'next/link';
import { type FormEvent, use, useState } from 'react';
import { Loading } from '@/components/Loading';
import { useActivity } from '@/hooks/useActivity';
import { useAllContexts } from '@/hooks/useAllContexts';
import type { Category, Energy, Priority } from '@/types';
import type { UpdateActivityRequest } from '@/types/api';
import { CATEGORY_OPTIONS, ENERGY_OPTIONS, PRIORITY_OPTIONS } from '@/types/constants';

interface ActivityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const resolvedParams = use(params);
  const { activity, isLoading, error, mutate } = useActivity(Number(resolvedParams.id));
  const {
    contexts: allContexts,
    isLoading: contextsLoading,
    error: contextsError,
  } = useAllContexts();

  // Estados para el formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const formData = new FormData(e.currentTarget);

      const data: UpdateActivityRequest = {
        title: formData.get('title') as string,
        category: Number(formData.get('category')) as Category,
        energy: Number(formData.get('energy')) as Energy,
        priority: Number(formData.get('priority')) as Priority,
        contexts: Array.from(formData.getAll('contexts')).map(Number),
      };

      console.log('Enviando datos:', data);

      // Enviar datos a través de la API route
      const response = await fetch(`/api/activities?id=${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar los cambios');
      }

      setSubmitMessage({ type: 'success', text: 'Cambios guardados exitosamente' });

      // Refrescar los datos usando SWR mutate
      await mutate();
    } catch (error) {
      console.error('Error al guardar:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al guardar los cambios',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar la eliminación
  const handleDelete = async () => {
    if (
      !confirm(
        '¿Estás seguro de que quieres eliminar esta actividad? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(`/api/activities?id=${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la actividad');
      }

      setSubmitMessage({ type: 'success', text: 'Actividad eliminada exitosamente' });

      // Redirigir a la página principal después de un breve delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al eliminar la actividad',
      });
    } finally {
      setIsDeleting(false);
    }
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
        <div className="text-center py-8 text-zinc-500">
          <p>Error al cargar la actividad: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-4 px-6 pb-20 pt-8">
        <div className="text-center py-8 text-zinc-500">
          <p className="text-lg">Actividad no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-4 px-6 pb-20 pt-8">
      <header className="flex flex-col">
        <Link href="/" className="text-base text-zinc-600 dark:text-zinc-400">
          Volver
        </Link>
        <h1 className="text-4xl font-bold text-black dark:text-zinc-200">{activity.title}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4">
          {/* input para editar titulo */}
          <div className="mb-6">
            <div className="uppercase text-base text-zinc-600 dark:text-zinc-400 mb-2">Título</div>
            <input
              type="text"
              name="title"
              defaultValue={activity.title}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              placeholder="Título de la actividad"
            />
          </div>

          <div className="flex gap-4">
            <div>
              <div className="uppercase text-base text-zinc-600 dark:text-zinc-400">Categoría</div>
              <select
                name="category"
                defaultValue={activity.category}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="uppercase text-base text-zinc-600 dark:text-zinc-400">Energía</div>
              <select
                name="energy"
                defaultValue={activity.energy}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              >
                {ENERGY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="uppercase text-base text-zinc-600 dark:text-zinc-400">Prioridad</div>
              <select
                name="priority"
                defaultValue={activity.priority}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
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

        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4">
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
                  className="mt-1 h-4 w-4 text-zinc-600 border-zinc-300 rounded focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700"
                />
                <div className="flex-1 flex justify-between">
                  <label
                    htmlFor={`context-${context.id}`}
                    className=" font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    {context.name}
                  </label>
                  <div className=" text-zinc-600 dark:text-zinc-400">
                    {context.days && <span>{context.days.join(', ')}</span>}
                    {context.time_start && context.time_end && (
                      <span>
                        {' - '}
                        {context.time_start} - {context.time_end}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {allContexts.length === 0 && (
              <p className=" text-zinc-500 dark:text-zinc-400">No hay contextos disponibles</p>
            )}
          </div>
        </div>

        {/* Mensaje de feedback */}
        {submitMessage && (
          <div
            className={`p-4 rounded-lg ${
              submitMessage.type === 'success'
                ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
                : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4 justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
            className={`px-4 py-2  font-medium rounded-lg transition-colors ${
              isDeleting || isSubmitting
                ? 'text-zinc-500 bg-zinc-300 dark:bg-zinc-600 cursor-not-allowed'
                : 'text-white bg-zinc-600 hover:bg-zinc-700'
            }`}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar Actividad'}
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-2  font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              disabled={isSubmitting || isDeleting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isDeleting}
              className={`px-4 py-2  font-medium rounded-lg transition-colors ${
                isSubmitting || isDeleting
                  ? 'text-zinc-500 bg-zinc-300 dark:bg-zinc-600 cursor-not-allowed'
                  : 'text-white bg-zinc-600 hover:bg-zinc-700'
              }`}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
