'use client';

import type { FormEvent } from 'react';

const DAYS_OPTIONS = [
  { value: 'Mon', label: 'Lunes' },
  { value: 'Tue', label: 'Martes' },
  { value: 'Wed', label: 'Miércoles' },
  { value: 'Thu', label: 'Jueves' },
  { value: 'Fri', label: 'Viernes' },
  { value: 'Sat', label: 'Sábado' },
  { value: 'Sun', label: 'Domingo' },
];

interface ContextFormProps {
  title: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitButtonText: string;
  submitButtonLoadingText: string;
  defaultValues?: {
    name?: string;
    days?: string[];
    time_start?: string;
    time_end?: string;
  };
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export function ContextForm({
  title,
  onSubmit,
  isSubmitting,
  submitButtonText,
  submitButtonLoadingText,
  defaultValues,
  onCancel,
  showCancelButton = false,
}: ContextFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">{title}</h2>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-base font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Nombre *
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaultValues?.name || ''}
            className="w-full px-4 py-4 text-base border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            placeholder="Ej: Mañana, Tarde, Noche"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-zinc-700 dark:text-zinc-300 mb-4">
            Días de la semana
          </label>
          <div className="grid grid-cols-2 gap-3">
            {DAYS_OPTIONS.map((day) => (
              <label
                key={day.value}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <input
                  type="checkbox"
                  name="days"
                  value={day.value}
                  defaultChecked={defaultValues?.days?.includes(day.value)}
                  className="h-6 w-6 text-zinc-600 border-zinc-300 rounded focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700"
                />
                <span className="text-base text-zinc-700 dark:text-zinc-300">{day.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Hora inicio
            </label>
            <input
              type="time"
              name="time_start"
              defaultValue={defaultValues?.time_start || ''}
              className="w-full px-4 py-4 text-base border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Hora fin
            </label>
            <input
              type="time"
              name="time_end"
              defaultValue={defaultValues?.time_end || ''}
              className="w-full px-4 py-4 text-base border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-4 text-base font-medium rounded-lg transition-colors ${
              isSubmitting
                ? 'text-zinc-500 bg-zinc-300 dark:bg-zinc-600 cursor-not-allowed'
                : 'text-white bg-zinc-600 hover:bg-zinc-700 active:bg-zinc-800'
            }`}
          >
            {isSubmitting ? submitButtonLoadingText : submitButtonText}
          </button>
          {showCancelButton && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-4 text-base font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-600 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-500 active:bg-zinc-400 dark:active:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
