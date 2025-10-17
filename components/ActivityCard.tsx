'use client';

import { useMemo, useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import type { ActivityWithDetails, UpdateActivityRequest } from '@/lib/types';
import { ENERGY_LEVEL_OPTIONS, PRIORITY_OPTIONS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: ActivityWithDetails;
  score?: number;
  reason?: string;
  onUpdate?: (id: number, data: UpdateActivityRequest) => Promise<void>;
  isMutating?: boolean;
}

export function ActivityCard({
  activity,
  score,
  reason,
  onUpdate,
  isMutating = false,
}: ActivityCardProps) {
  const isCompleted = activity.is_completed === 1;
  const { categories } = useCategories();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: activity.title,
    category_id: activity.category_id,
    priority: activity.priority,
    energy_level: activity.energy_level || 'medium',
    contexts: activity.contexts?.map((c) => c.id) || [],
  });

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ value: cat.id, label: cat.name })),
    [categories]
  );

  // Helper to update form data
  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle update
  const handleUpdate = async () => {
    if (!onUpdate) return;

    setIsSaving(true);
    try {
      await onUpdate(activity.id, {
        title: formData.title,
        category_id: formData.category_id,
        priority: formData.priority,
        energy_level: formData.energy_level,
        contexts: formData.contexts,
      });
    } catch (error) {
      console.error('Error updating activity:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 space-y-4',
        isCompleted
          ? 'bg-neutral-100 border-neutral-200 opacity-70 dark:bg-neutral-800 dark:border-neutral-700'
          : 'bg-white border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700',
        (isMutating || isSaving) && 'opacity-50 pointer-events-none'
      )}
    >
      <div className="flex gap-3 justify-between items-center">
        {/* Title */}
        <div className="flex-1">
          <input
            id={`title-${activity.id}`}
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="Título de la actividad"
            className="w-full px-3 py-2 border rounded-md text-sm bg-white border-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={isSaving}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Category */}
        <div>
          <select
            id={`category-${activity.id}`}
            value={formData.category_id ?? ''}
            onChange={(e) =>
              updateFormData('category_id', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-3 py-2 border rounded-md text-sm bg-white border-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Categoría</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <select
            id={`priority-${activity.id}`}
            value={formData.priority}
            onChange={(e) => updateFormData('priority', e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm bg-white border-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Energy Level */}
        <div>
          <select
            id={`energy-${activity.id}`}
            value={formData.energy_level}
            onChange={(e) => updateFormData('energy_level', e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm bg-white border-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ENERGY_LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contexts */}
      <div>
        <div className="flex flex-wrap gap-3">
          {activity.contexts?.map((context) => (
            <div key={context.id} className="flex items-center">
              <input
                type="checkbox"
                id={`context-${activity.id}-${context.id}`}
                checked={formData.contexts.includes(context.id)}
                onChange={(e) => {
                  const newContexts = e.target.checked
                    ? [...formData.contexts, context.id]
                    : formData.contexts.filter((id) => id !== context.id);
                  updateFormData('contexts', newContexts);
                }}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
              />
              <label
                htmlFor={`context-${activity.id}-${context.id}`}
                className="text-sm text-neutral-700 dark:text-neutral-300"
              >
                {context.name}
              </label>
            </div>
          ))}
          {(!activity.contexts || activity.contexts.length === 0) && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Sin contextos asignados
            </p>
          )}
        </div>
      </div>

      {/* Reason (for suggestions) */}
      {reason && score !== undefined && (
        <div>
          <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Razón de Sugerencia
          </span>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 p-2 rounded">
            {reason}
          </p>
        </div>
      )}
    </div>
  );
}
