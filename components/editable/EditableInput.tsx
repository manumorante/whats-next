'use client';

import { useState } from 'react';

interface EditableInputProps {
  value: string | number | null;
  onSave: (value: string | number | null) => Promise<void>;
  placeholder?: string;
  type?: 'text' | 'number';
  min?: number;
  className?: string;
  displayFormatter?: (value: string | number | null) => string;
  inputClassName?: string;
  buttonClassName?: string;
}

export function EditableInput({
  value,
  onSave,
  placeholder = 'Añadir...',
  type = 'text',
  min,
  className = '',
  displayFormatter,
  inputClassName = '',
  buttonClassName = '',
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
        className={inputClassName || className}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        startEditing();
      }}
      className={buttonClassName || className}
    >
      {displayValue}
    </button>
  );
}
