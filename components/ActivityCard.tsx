'use client';

import { useRef, useState } from 'react';
import { Badge } from '@/components/Badge';
import {
  EditableBadge,
  EditableInput,
  EditableTextarea,
  type SelectOption,
} from '@/components/editable';
import { useCategories } from '@/hooks/useCategories';
import type { ActivityWithDetails, UpdateActivityRequest } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: ActivityWithDetails;
  score?: number;
  reason?: string;
  onComplete?: (id: number) => void;
  onToggle?: (id: number) => void;
  onUpdate?: (id: number, data: UpdateActivityRequest) => Promise<void>;
  isMutating?: boolean;
}

export function ActivityCard({
  activity,
  score,
  reason,
  onComplete,
  onToggle,
  onUpdate,
  isMutating = false,
}: ActivityCardProps) {
  const isCompleted = activity.is_completed === 1;
  const isRecurring = activity.is_recurring === 1;
  const { categories } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

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
        {/* Title - Editable only when open */}
        <div className="flex-1 min-w-0" key={isOpen ? 'open' : 'closed'}>
          {isOpen ? (
            <EditableInput
              value={activity.title}
              onSave={(value) => updateField('title', value)}
              placeholder="Sin título"
              inputClassName="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-base font-medium text-neutral-100 focus:outline-none focus:border-neutral-600"
              className={cn(
                'inline-block text-left text-base font-medium cursor-pointer hover:text-neutral-300 transition-colors',
                isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-100'
              )}
            />
          ) : (
            <h3
              className={cn(
                'text-base font-medium',
                isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-100'
              )}
            >
              {activity.title}
            </h3>
          )}
        </div>

        {/* Toggle Caret - Always visible */}
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
      </summary>

      {/* Expanded content - Editable */}
      <div className="mt-3" key={isOpen ? 'open' : 'closed'}>
        {/* Description - Editable */}
        <EditableTextarea
          value={activity.description}
          onSave={(value) => updateField('description', value)}
          placeholder="Añadir descripción..."
          rows={2}
          className="mb-3"
          textareaClassName="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-sm text-neutral-400 focus:outline-none focus:border-neutral-600 resize-none"
          buttonClassName="text-sm text-neutral-400 cursor-pointer hover:text-neutral-300 transition-colors text-left w-full"
        />

        <div className="flex justify-between items-center">
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
              />
            )}

            {/* Priority */}
            <EditableBadge
              value={activity.priority}
              options={priorityOptions}
              onSave={(value) => updateField('priority', value)}
              displayFormatter={(value) => priorityLabels[value as keyof typeof priorityLabels]}
            />

            {/* Energy Level */}
            <EditableBadge
              value={activity.energy_level || 'medium'}
              options={energyOptions}
              onSave={(value) => updateField('energy_level', value)}
              displayFormatter={(value) =>
                energyLabels[value as keyof typeof energyLabels] || 'Añadir energía'
              }
            />

            {/* Recurring */}
            {isRecurring && <Badge>{activity.recurrence_type}</Badge>}
          </div>

          {/* Complete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isRecurring && onComplete ? onComplete(activity.id) : onToggle?.(activity.id);
            }}
            className={cn(
              'px-4 py-1 rounded-full text-sm font-medium transition-all',
              isCompleted
                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                : 'bg-green-800 text-white hover:bg-green-600'
            )}
            disabled={isMutating || isCompleted}
          >
            {isCompleted ? 'Completada' : 'Completar'}
          </button>
        </div>

        {/* Contexts */}
        {activity.contexts && activity.contexts.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {activity.contexts.map((context) => (
              <Badge key={context.id}>{context.label}</Badge>
            ))}
          </div>
        )}

        {/* Reason (for suggestions) */}
        {reason && score !== undefined && (
          <div className="mt-2 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">{reason}</p>
              <span className="text-xs font-mono text-neutral-600">{score}pts</span>
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
