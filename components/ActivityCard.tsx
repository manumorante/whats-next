'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  EditableBadge,
  EditableContexts,
  EditableInput,
  type SelectOption,
} from '@/components/editable';
import { useCategories } from '@/hooks/useCategories';
import type { ActivityWithDetails, UpdateActivityRequest } from '@/lib/types';
import { cn } from '@/lib/utils';

const PRIORITY_LABELS = {
  urgent: 'Urgente',
  important: 'Importante',
  someday: 'Algún día',
} as const;

const ENERGY_LABELS = {
  low: 'Ligera',
  medium: 'Moderada',
  high: 'Intensa',
} as const;

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: 'urgent', label: 'Urgente' },
  { value: 'important', label: 'Importante' },
  { value: 'someday', label: 'Algún día' },
];

const ENERGY_OPTIONS: SelectOption[] = [
  { value: 'low', label: 'Ligera' },
  { value: 'medium', label: 'Moderada' },
  { value: 'high', label: 'Intensa' },
];

interface BadgeConfig {
  key: string;
  value: string | number;
  options: SelectOption[];
  onSave: (value: string | number) => Promise<void>;
  displayFormatter: (value: string | number) => string;
}

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

  const categoryOptions = useMemo<SelectOption[]>(
    () => categories.map((cat) => ({ value: cat.id, label: cat.name })),
    [categories]
  );

  // Helper to update a field
  const updateField = async (field: string, value: unknown) => {
    if (!onUpdate) return;
    await onUpdate(activity.id, { [field]: value });
  };

  const handleEditComplete = () => setIsEditMode(false);

  const badgeConfigs: BadgeConfig[] = [
    ...(activity.category
      ? [
          {
            key: 'category',
            value: activity.category_id ?? 0,
            options: categoryOptions,
            onSave: (value: string | number) => updateField('category_id', value),
            displayFormatter: (value: string | number) => {
              const cat = categories.find((category) => category.id === Number(value));
              return cat?.name || '';
            },
          },
        ]
      : []),
    {
      key: 'priority',
      value: activity.priority,
      options: PRIORITY_OPTIONS,
      onSave: (value: string | number) => updateField('priority', value),
      displayFormatter: (value: string | number) =>
        PRIORITY_LABELS[value as keyof typeof PRIORITY_LABELS],
    },
    {
      key: 'energy',
      value: activity.energy_level || 'medium',
      options: ENERGY_OPTIONS,
      onSave: (value: string | number) => updateField('energy_level', value),
      displayFormatter: (value: string | number) =>
        ENERGY_LABELS[value as keyof typeof ENERGY_LABELS] || 'Añadir energía',
    },
  ];

  return (
    <details
      ref={detailsRef}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
      className={cn(
        'group relative rounded-3xl border transition-all shadow-sm p-4',
        isCompleted
          ? 'bg-neutral-200/80 border-neutral-200 opacity-70 dark:bg-neutral-900 dark:border-neutral-800'
          : 'bg-white/95 border-neutral-200 hover:border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-700',
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
            onEditComplete={handleEditComplete}
            className={cn(
              'w-full text-base font-medium',
              isCompleted
                ? 'text-neutral-500 line-through dark:text-neutral-500'
                : 'text-neutral-900 dark:text-neutral-100'
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
            className={cn('px-3 py-1 rounded-full text-xs font-medium transition-all', {
              'bg-neutral-900 text-white dark:bg-neutral-600': isEditMode,
              'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700':
                !isEditMode,
            })}
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
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-green-800 dark:hover:bg-green-600'
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
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {badgeConfigs.map((badge) => (
            <EditableBadge
              key={badge.key}
              value={badge.value}
              options={badge.options}
              onSave={badge.onSave}
              displayFormatter={badge.displayFormatter}
              isEditMode={isEditMode}
              onEditComplete={handleEditComplete}
            />
          ))}
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
        {reason && score !== undefined && (
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">{reason}</p>
        )}
      </div>
    </details>
  );
}
