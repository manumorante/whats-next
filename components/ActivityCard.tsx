'use client';

import { useState } from 'react';
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

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const energyColors = {
    low: 'text-blue-400 bg-blue-500/10',
    medium: 'text-yellow-400 bg-yellow-500/10',
    high: 'text-red-400 bg-red-500/10',
  };

  const priorityLabels = {
    urgent: 'Must Do',
    important: 'Should Do',
    someday: 'Nice to Have',
  };

  const priorityColors = {
    urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
    important: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    someday: 'bg-neutral-700/50 text-neutral-400 border-neutral-600/20',
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = async (field: string, newValue: unknown, originalValue: unknown) => {
    if (!onUpdate) {
      cancelEditing();
      return;
    }

    // Only update if value has changed
    if (newValue === originalValue) {
      cancelEditing();
      return;
    }

    try {
      await onUpdate(activity.id, { [field]: newValue });
      cancelEditing();
    } catch (error) {
      console.error('Error updating field:', error);
      cancelEditing();
    }
  };

  return (
    <details
      className={cn(
        'group relative bg-neutral-900 rounded-lg p-4 border transition-all',
        isCompleted
          ? 'border-neutral-800 opacity-60'
          : 'border-neutral-800 hover:border-neutral-700',
        isMutating && 'opacity-50 pointer-events-none'
      )}
    >
      <summary className="cursor-pointer list-none flex items-start gap-3 [&::-webkit-details-marker]:hidden">
        {/* Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            isRecurring && onComplete ? onComplete(activity.id) : onToggle?.(activity.id);
          }}
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors',
            isCompleted
              ? 'bg-green-500 border-green-500'
              : 'border-neutral-600 hover:border-neutral-500'
          )}
          disabled={isMutating}
        >
          {isCompleted && (
            <svg
              className="w-full h-full text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Completado</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Title */}
        <h3
          className={cn(
            'text-base font-medium flex-1',
            isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-100'
          )}
        >
          {activity.title}
        </h3>
      </summary>

      {/* Category Badge */}
      {activity.category && (
        <button
          type="button"
          className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80"
          style={{
            backgroundColor: `${activity.category.color}20`,
            color: activity.category.color,
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (editingField === 'category') {
              cancelEditing();
            } else {
              startEditing('category', String(activity.category_id || ''));
            }
          }}
        >
          {editingField === 'category' ? (
            <select
              value={editValue}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                saveEdit('category_id', newValue, activity.category_id);
              }}
              onBlur={cancelEditing}
              className="bg-neutral-800 text-neutral-100 text-xs rounded px-1 py-0.5 border-none focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : (
            activity.category.name
          )}
        </button>
      )}

      {/* Expanded content - Editable */}
      <div className="mt-3 ml-8">
        {/* Title - Editable */}
        <div className="mb-3">
          {editingField === 'title' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit('title', editValue, activity.title)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                } else if (e.key === 'Escape') {
                  cancelEditing();
                }
              }}
              className="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-base font-medium text-neutral-100 focus:outline-none focus:border-neutral-600"
            />
          ) : (
            <button
              type="button"
              onClick={() => startEditing('title', activity.title)}
              className={cn(
                'text-base font-medium cursor-pointer hover:text-neutral-300 transition-colors text-left w-full',
                isCompleted ? 'text-neutral-500' : 'text-neutral-100'
              )}
            >
              {activity.title}
            </button>
          )}
        </div>

        {/* Description - Editable */}
        <div className="mb-3">
          {editingField === 'description' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit('description', editValue || null, activity.description)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  cancelEditing();
                }
              }}
              rows={2}
              className="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-sm text-neutral-400 focus:outline-none focus:border-neutral-600 resize-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => startEditing('description', activity.description || '')}
              className="text-sm text-neutral-400 cursor-pointer hover:text-neutral-300 transition-colors text-left w-full"
            >
              {activity.description || 'Add description...'}
            </button>
          )}
        </div>

        {/* Metadata - Editable */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Priority - Editable */}
          {editingField === 'priority' ? (
            <select
              value={editValue}
              onChange={(e) => saveEdit('priority', e.target.value, activity.priority)}
              onBlur={cancelEditing}
              className="px-2 py-0.5 text-xs rounded font-medium border bg-neutral-800 text-neutral-100 focus:outline-none"
            >
              <option value="urgent">Must Do</option>
              <option value="important">Should Do</option>
              <option value="someday">Nice to Have</option>
            </select>
          ) : (
            <button
              type="button"
              onClick={() => startEditing('priority', activity.priority)}
              className={cn(
                'px-2 py-0.5 text-xs rounded font-medium border cursor-pointer hover:opacity-80 transition-opacity',
                priorityColors[activity.priority]
              )}
            >
              {priorityLabels[activity.priority]}
            </button>
          )}

          {/* Duration - Editable */}
          {editingField === 'duration' ? (
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => {
                const newValue = editValue ? Number(editValue) : null;
                saveEdit('duration_minutes', newValue, activity.duration_minutes);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                } else if (e.key === 'Escape') {
                  cancelEditing();
                }
              }}
              min="1"
              className="w-16 px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded focus:outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => startEditing('duration', String(activity.duration_minutes || ''))}
              className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded cursor-pointer hover:bg-neutral-700 transition-colors"
            >
              {activity.duration_minutes ? `${activity.duration_minutes} min` : 'Add duration'}
            </button>
          )}

          {/* Energy Level - Editable */}
          {editingField === 'energy' ? (
            <select
              value={editValue}
              onChange={(e) => saveEdit('energy_level', e.target.value, activity.energy_level)}
              onBlur={cancelEditing}
              className="px-2 py-0.5 text-xs rounded font-medium bg-neutral-800 text-neutral-100 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          ) : (
            <button
              type="button"
              onClick={() => startEditing('energy', activity.energy_level || 'medium')}
              className={cn(
                'px-2 py-0.5 text-xs rounded font-medium cursor-pointer hover:opacity-80 transition-opacity',
                activity.energy_level
                  ? energyColors[activity.energy_level]
                  : 'bg-neutral-800 text-neutral-400'
              )}
            >
              {activity.energy_level === 'low' && 'Low'}
              {activity.energy_level === 'medium' && 'Medium'}
              {activity.energy_level === 'high' && 'High'}
              {!activity.energy_level && 'Add energy'}
            </button>
          )}

          {/* Location - Editable */}
          {editingField === 'location' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit('location', editValue || null, activity.location)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                } else if (e.key === 'Escape') {
                  cancelEditing();
                }
              }}
              className="w-24 px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded focus:outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => startEditing('location', activity.location || '')}
              className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded cursor-pointer hover:bg-neutral-700 transition-colors"
            >
              {activity.location || 'Add location'}
            </button>
          )}

          {/* Recurring - Show only */}
          {isRecurring && (
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded">
              {activity.recurrence_type}
            </span>
          )}
        </div>

        {/* Contexts */}
        {activity.contexts && activity.contexts.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {activity.contexts.map((context) => (
              <span
                key={context.id}
                className="px-2 py-0.5 bg-neutral-800/50 text-neutral-400 text-xs rounded"
              >
                {context.label}
              </span>
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

        {/* Completion stats */}
        {activity.completions_count !== undefined && activity.completions_count > 0 && (
          <p className="text-xs text-neutral-500 mt-2">
            Completada {activity.completions_count}{' '}
            {activity.completions_count === 1 ? 'vez' : 'veces'}
            {activity.last_completed && (
              <> · Última: {new Date(activity.last_completed).toLocaleDateString('es-ES')}</>
            )}
          </p>
        )}
      </div>
    </details>
  );
}
