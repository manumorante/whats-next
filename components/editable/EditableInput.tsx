'use client';

import { useState } from 'react';
import { Badge } from '@/components/Badge';

interface EditableInputProps {
  value: string | number | null;
  onSave: (value: string | number | null) => Promise<void>;
  placeholder?: string;
  type?: 'text' | 'number';
  min?: number;
  displayFormatter?: (value: string | number | null) => string;
  inputClassName?: string;
  className?: string;
}

export function EditableInput({
  value,
  onSave,
  placeholder = 'Añadir...',
  type = 'text',
  min,
  displayFormatter,
  inputClassName = '',
  className,
}: EditableInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const displayValue = displayFormatter
    ? displayFormatter(value)
    : value?.toString() || placeholder;

  const startEditing = () => {
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

  if (isEditing) {
    return (
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          } else if (e.key === 'Escape') {
            cancelEditing();
          }
        }}
        min={min}
        className={inputClassName}
      />
    );
  }

  return (
    <Badge
      onClick={(e) => {
        e.stopPropagation();
        startEditing();
      }}
      className={className}
    >
      {displayValue}
    </Badge>
  );
}
