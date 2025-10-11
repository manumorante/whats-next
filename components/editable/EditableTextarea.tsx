'use client';

import { useState } from 'react';

interface EditableTextareaProps {
  value: string | null;
  onSave: (value: string | null) => Promise<void>;
  placeholder?: string;
  rows?: number;
  className?: string;
  textareaClassName?: string;
  buttonClassName?: string;
}

export function EditableTextarea({
  value,
  onSave,
  placeholder = 'Añadir...',
  rows = 2,
  className = '',
  textareaClassName = '',
  buttonClassName = '',
}: EditableTextareaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const startEditing = () => {
    setIsEditing(true);
    setEditValue(value || '');
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleSave = async () => {
    const newValue = editValue.trim() === '' ? null : editValue;
    const originalValue = value;

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
      <textarea
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            cancelEditing();
          }
        }}
        rows={rows}
        className={textareaClassName || className}
      />
    );
  }

  return (
    <button type="button" onClick={startEditing} className={buttonClassName || className}>
      {value || placeholder}
    </button>
  );
}
