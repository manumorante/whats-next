'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface EditableInputProps {
  value: string | number | null;
  onSave: (value: string | number | null) => Promise<void>;
  placeholder?: string;
  type?: 'text' | 'number';
  min?: number;
  editable?: boolean;
  className?: string;
}

export function EditableInput({
  value,
  onSave,
  placeholder = 'Añadir...',
  type = 'text',
  min,
  editable = true,
  className = '',
}: EditableInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const startEditing = () => {
    if (!editable) return;
    setIsEditing(true);
    setEditValue(value?.toString() || '');
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleSave = async () => {
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
      cancelEditing();
      return;
    }

    try {
      await onSave(newValue);
      cancelEditing();
    } catch (error) {
      console.error('Error saving:', error);
      cancelEditing();
    }
  };

  return (
    <input
      type={type}
      value={isEditing ? editValue : value || ''}
      onChange={(e) => setEditValue(e.target.value)}
      onFocus={startEditing}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        } else if (e.key === 'Escape') {
          cancelEditing();
        }
      }}
      min={min}
      placeholder={placeholder}
      readOnly={!isEditing}
      className={cn(
        'bg-transparent border-0 p-0 text-neutral-300',
        editable && !isEditing && 'cursor-pointer hover:text-neutral-100',
        !editable && 'pointer-events-none',
        isEditing &&
          'px-2 py-1 bg-neutral-800 border border-neutral-700 rounded focus:outline-none focus:border-neutral-600',
        className
      )}
    />
  );
}
