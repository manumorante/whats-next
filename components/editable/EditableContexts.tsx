'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/Badge';
import type { ContextParsed } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EditableContextsProps {
  selectedContextIds: number[];
  onSave: (contextIds: number[]) => Promise<void>;
  isEditMode?: boolean;
}

export function EditableContexts({
  selectedContextIds,
  onSave,
  isEditMode = false,
}: EditableContextsProps) {
  const [allContexts, setAllContexts] = useState<ContextParsed[]>([]);
  const [tempSelected, setTempSelected] = useState<number[]>(selectedContextIds);
  const [isSaving, setIsSaving] = useState(false);
  const previousEditMode = useRef(isEditMode);
  const onSaveRef = useRef(onSave);
  const tempSelectedRef = useRef(tempSelected);
  const selectedContextIdsRef = useRef(selectedContextIds);

  // Update refs
  useEffect(() => {
    onSaveRef.current = onSave;
    tempSelectedRef.current = tempSelected;
    selectedContextIdsRef.current = selectedContextIds;
  });

  // Load all contexts
  useEffect(() => {
    fetch('/api/contexts')
      .then(res => res.json())
      .then(setAllContexts)
      .catch(console.error);
  }, []);

  // Sync temp selected with props when entering edit mode
  useEffect(() => {
    if (isEditMode && !previousEditMode.current) {
      setTempSelected(selectedContextIds);
    }
  }, [isEditMode, selectedContextIds]);

  // Auto-save when leaving edit mode
  useEffect(() => {
    const save = async () => {
      // Only save when transitioning from edit mode to view mode
      if (!isEditMode && previousEditMode.current) {
        const currentSorted = JSON.stringify([...tempSelectedRef.current].sort());
        const originalSorted = JSON.stringify([...selectedContextIdsRef.current].sort());

        if (currentSorted !== originalSorted) {
          setIsSaving(true);
          try {
            await onSaveRef.current(tempSelectedRef.current);
          } finally {
            setIsSaving(false);
          }
        }
      }

      previousEditMode.current = isEditMode;
    };

    save();
  }, [isEditMode]);

  const handleToggle = (contextId: number) => {
    if (!isEditMode) return;

    const newSelection = tempSelected.includes(contextId)
      ? tempSelected.filter((id) => id !== contextId)
      : [...tempSelected, contextId];

    setTempSelected(newSelection);
  };

  if (!isEditMode && selectedContextIds.length === 0) {
    return (
      <div className="text-xs text-neutral-600 italic">
        Sin contextos (no aparecerá en sugerencias)
      </div>
    );
  }

  const selectedContexts = allContexts.filter((c) => tempSelected.includes(c.id));
  const availableContexts = allContexts.filter((c) => !tempSelected.includes(c.id));

  return (
    <div className="space-y-2">
      {/* Selected contexts */}
      {selectedContexts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedContexts.map((context) => (
            <Badge
              key={context.id}
              onClick={isEditMode ? () => handleToggle(context.id) : undefined}
              className={cn(isEditMode && 'cursor-pointer hover:bg-red-900 hover:line-through')}
            >
              {context.label}
              {isEditMode && ' ×'}
            </Badge>
          ))}
        </div>
      )}

      {/* Available contexts (only in edit mode) */}
      {isEditMode && availableContexts.length > 0 && (
        <div className="pt-1 border-t border-neutral-800">
          <div className="text-xs text-neutral-500 mb-1">Agregar contextos:</div>
          <div className="flex flex-wrap gap-1.5">
            {availableContexts.map((context) => (
              <Badge
                key={context.id}
                onClick={() => handleToggle(context.id)}
                className="cursor-pointer opacity-50 hover:opacity-100 hover:bg-green-900"
              >
                + {context.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {isSaving && <div className="text-xs text-neutral-500">Guardando...</div>}
    </div>
  );
}
