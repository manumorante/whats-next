'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface EditableInputProps {
  value: string | number | null;
  onSave: (value: string | number | null) => Promise<void>;
  placeholder?: string;
  type?: 'text' | 'number';
  min?: number;
  isEditMode?: boolean;
  onEditComplete?: () => void;
  className?: string;
}

export function EditableInput({
  value,
  onSave,
  placeholder = 'Añadir...',
  type = 'text',
  min,
  isEditMode = false,
  onEditComplete,
  className = '',
}: EditableInputProps) {
  const [editValue, setEditValue] = useState(value?.toString() || '');
  const previousEditModeRef = useRef(isEditMode);

  // Sync editValue with value when entering edit mode
  useEffect(() => {
    if (isEditMode && !previousEditModeRef.current) {
      setEditValue(value?.toString() || '');
    }
    previousEditModeRef.current = isEditMode;
  }, [isEditMode, value]);

  const handleBlur = async () => {
    if (!isEditMode) return;

    const originalValue = value;
    let newValue: string | number | null = editValue;

    // Handle empty values
    if (!editValue || editValue.trim() === '') {
      newValue = null;
    } else if (type === 'number') {
      newValue = Number(editValue);
    }

    // Only save if changed
    if (newValue === originalValue) {
      return;
    }

    try {
      await onSave(newValue);
    } catch (error) {
      console.error('Error saving:', error);
      // Reset to original value on error
      setEditValue(value?.toString() || '');
    }
  };

  return (
    <input
      type={type}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onEditComplete?.();
          e.currentTarget.blur();
        } else if (e.key === 'Escape') {
          setEditValue(value?.toString() || '');
          onEditComplete?.();
        }
      }}
      min={min}
      placeholder={placeholder}
      readOnly={!isEditMode}
      className={cn(
        'px-2 py-1 text-neutral-300',
        isEditMode
          ? 'bg-neutral-800 border border-neutral-700 rounded focus:outline-none focus:border-neutral-600'
          : 'bg-transparent border border-transparent pointer-events-none',
        className
      )}
    />
  );
}
