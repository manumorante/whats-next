'use client';

import { useEffect, useRef, useState } from 'react';
import {
  EditableBadge,
  EditableContexts,
  EditableInput,
  type SelectOption,
} from '@/components/editable';
import { useCategories } from '@/hooks/useCategories';
import type { ActivityWithDetails, UpdateActivityRequest } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: ActivityWithDetails;
  score?: number;
  reason?: string;
  onToggle?: (id: number) => void;
  onUpdate?: (id: number, data: UpdateActivityRequest) => Promise<void>;
  isMutating?: boolean;
}

export function ActivityCard({
  activity,
  score,
  reason,
  onToggle,
  onUpdate,
  isMutating = false,
}: ActivityCardProps) {
  const isCompleted = activity.is_completed === 1;
  const { categories } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Reset edit mode when card is closed
  useEffect(() => {
    if (!isOpen) {
      setIsEditMode(false);
    }
  }, [isOpen]);

  const priorityLabels = {
    urgent: 'Urgente',
    important: 'Importante',
    someday: 'Algún día',
  };

  const energyLabels = {
    low: 'Ligera',
    medium: 'Moderada',
    high: 'Intensa',
  };

  // Options for selects
  const priorityOptions: SelectOption[] = [
    { value: 'urgent', label: 'Urgente' },
    { value: 'important', label: 'Importante' },
    { value: 'someday', label: 'Algún día' },
  ];

  const energyOptions: SelectOption[] = [
    { value: 'low', label: 'Ligera' },
    { value: 'medium', label: 'Moderada' },
    { value: 'high', label: 'Intensa' },
  ];

  const categoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  // Helper to update a field
  const updateField = async (field: string, value: unknown) => {
    if (!onUpdate) return;
    await onUpdate(activity.id, { [field]: value });
  };

  return (
    <details
      ref={detailsRef}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
      className={cn(
        'group relative bg-neutral-900 rounded-lg p-4 border transition-all',
        isCompleted
          ? 'border-neutral-800 opacity-60'
          : 'border-neutral-800 hover:border-neutral-700',
        isMutating && 'opacity-50 pointer-events-none'
      )}
    >
      <summary className="list-none flex items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        {/* Title - Editable */}
        <div className="flex-1 min-w-0">
          <EditableInput
            value={activity.title}
            onSave={(value) => updateField('title', value)}
            placeholder="Sin título"
            isEditMode={isEditMode}
            onEditComplete={() => setIsEditMode(false)}
            className={cn(
              'w-full text-base font-medium',
              isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-100'
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEditMode(!isEditMode);
            }}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all',
              isEditMode
                ? 'bg-neutral-600 text-neutral-200'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            )}
          >
            {isEditMode ? 'Guardar' : 'Editar'}
          </button>

          {/* Complete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle?.(activity.id);
            }}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all',
              isCompleted
                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                : 'bg-green-800 text-white hover:bg-green-600'
            )}
            disabled={isMutating || isCompleted}
          >
            {isCompleted ? 'Completada' : score ? `${score}pts` : 'Completar'}
          </button>

          {/* Toggle Caret */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (detailsRef.current) {
                detailsRef.current.open = !detailsRef.current.open;
              }
            }}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-all flex items-center justify-center text-neutral-400 hover:text-neutral-300"
            aria-label={isOpen ? 'Cerrar' : 'Abrir'}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
            >
              <title>{isOpen ? 'Cerrar' : 'Abrir'}</title>
              <path d="M3 8L6 5L9 8" />
            </svg>
          </button>
        </div>
      </summary>

      {/* Expanded content - Editable */}
      <div className="mt-3" key={isOpen ? 'open' : 'closed'}>
        {/* Metadata - Editable */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Category */}
          {activity.category && (
            <EditableBadge
              value={activity.category_id || 0}
              options={categoryOptions}
              onSave={(value) => updateField('category_id', value)}
              displayFormatter={(value) => {
                const cat = categories.find((c) => c.id === value);
                return cat?.name || '';
              }}
              isEditMode={isEditMode}
              onEditComplete={() => setIsEditMode(false)}
            />
          )}

          {/* Priority */}
          <EditableBadge
            value={activity.priority}
            options={priorityOptions}
            onSave={(value) => updateField('priority', value)}
            displayFormatter={(value) => priorityLabels[value as keyof typeof priorityLabels]}
            isEditMode={isEditMode}
            onEditComplete={() => setIsEditMode(false)}
          />

          {/* Energy Level */}
          <EditableBadge
            value={activity.energy_level || 'medium'}
            options={energyOptions}
            onSave={(value) => updateField('energy_level', value)}
            displayFormatter={(value) =>
              energyLabels[value as keyof typeof energyLabels] || 'Añadir energía'
            }
            isEditMode={isEditMode}
            onEditComplete={() => setIsEditMode(false)}
          />
        </div>

        {/* Contexts - Editable */}
        <div className="flex gap-2 items-center">
          <div className="text-xs text-neutral-500">
            Contextos{isEditMode && ' (click para agregar/quitar)'}:
          </div>
          <EditableContexts
            selectedContextIds={activity.contexts?.map((c) => c.id) || []}
            onSave={(contextIds) => updateField('contexts', contextIds)}
            isEditMode={isEditMode}
          />
        </div>

        {/* Reason (for suggestions) */}
        {reason && score !== undefined && <p className="text-xs text-neutral-500 mt-2">{reason}</p>}
      </div>
    </details>
  );
}
