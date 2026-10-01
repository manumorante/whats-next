'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';
import { ContextForm } from '@/components/ContextForm';
import { Loading } from '@/components/Loading';
import { useAllContexts } from '@/hooks/useAllContexts';

export default function ContextsPage() {
  const { contexts, isLoading, error } = useAllContexts();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Función para crear contexto
  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    setSubmitMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const selectedDays = Array.from(formData.getAll('days'));

      const data = {
        name: formData.get('name') as string,
        days: selectedDays.length > 0 ? selectedDays : null,
        time_start: (formData.get('time_start') as string) || null,
        time_end: (formData.get('time_end') as string) || null,
      };

      const response = await fetch('/api/contexts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el contexto');
      }

      setSubmitMessage({ type: 'success', text: 'Contexto creado exitosamente' });
      e.currentTarget.reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error al crear:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al crear el contexto',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Función para editar contexto
  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(true);
    setSubmitMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const selectedDays = Array.from(formData.getAll('days'));

      const data = {
        name: formData.get('name') as string,
        days: selectedDays.length > 0 ? selectedDays : null,
        time_start: (formData.get('time_start') as string) || null,
        time_end: (formData.get('time_end') as string) || null,
      };

      const response = await fetch(`/api/contexts?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el contexto');
      }

      setSubmitMessage({ type: 'success', text: 'Contexto actualizado exitosamente' });
      setEditingId(null);
    } catch (error) {
      console.error('Error al editar:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al actualizar el contexto',
      });
    } finally {
      setIsEditing(false);
    }
  };

  // Función para eliminar contexto
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el contexto "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/contexts?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el contexto');
      }

      setSubmitMessage({ type: 'success', text: 'Contexto eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al eliminar el contexto',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-zinc-500 text-lg">Error al cargar contextos: {error.message}</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 bg-zinc-600 text-white rounded-lg">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="p-4 pb-20">
        {/* Mensaje de feedback */}
        {submitMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitMessage.type === 'success'
                ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
                : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        {/* Formulario de creación */}
        {showCreateForm && (
          <div className="mb-6">
            <ContextForm
              title="Crear Contexto"
              onSubmit={handleCreate}
              isSubmitting={isCreating}
              submitButtonText="Crear Contexto"
              submitButtonLoadingText="Creando..."
              onCancel={() => setShowCreateForm(false)}
              showCancelButton={true}
            />
          </div>
        )}

        {/* Header y botón */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Contextos Existentes
          </h2>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-zinc-600 text-white text-base font-medium rounded-lg hover:bg-zinc-700 active:bg-zinc-800 transition-colors"
            >
              + Nuevo
            </button>
          )}
        </div>

        {/* Lista de contextos */}
        {contexts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-zinc-400 dark:text-zinc-500 mb-6">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-6">
              No hay contextos creados
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-4 bg-zinc-600 text-white text-lg font-medium rounded-lg hover:bg-zinc-700 active:bg-zinc-800 transition-colors"
            >
              Crear primer contexto
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {contexts.map((context) =>
              editingId === context.id ? (
                <div key={context.id} className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <ContextForm
                    title="Editar Contexto"
                    onSubmit={handleEdit}
                    isSubmitting={isEditing}
                    submitButtonText="Guardar"
                    submitButtonLoadingText="Guardando..."
                    defaultValues={{
                      name: context.name,
                      days: context.days || [],
                      time_start: context.time_start || '',
                      time_end: context.time_end || '',
                    }}
                    onCancel={() => setEditingId(null)}
                    showCancelButton={true}
                  />
                </div>
              ) : (
                <div
                  key={context.id}
                  className="p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-3">
                        {context.name}
                      </h3>
                      {(context.days || context.time_start) && (
                        <div className="space-y-3">
                          {context.days && (
                            <div className="flex flex-wrap gap-2">
                              {context.days.map((day) => (
                                <span
                                  key={day}
                                  className="inline-flex items-center px-3 py-2 rounded-lg text-base font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                                >
                                  {day}
                                </span>
                              ))}
                            </div>
                          )}
                          {context.time_start && context.time_end && (
                            <div className="flex items-center text-base text-zinc-500 dark:text-zinc-400">
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {context.time_start} - {context.time_end}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 ml-6">
                      <button
                        onClick={() => setEditingId(context.id)}
                        className="p-3 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(context.id, context.name)}
                        className="p-3 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
