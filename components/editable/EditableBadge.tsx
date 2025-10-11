'use client';

import { useState } from 'react';
import type { SelectOption } from './EditableSelect';

interface EditableBadgeProps {
  value: string | number;
  options: SelectOption[];
  onSave: (value: string | number) => Promise<void>;
  displayFormatter: (value: string | number) => string;
  badgeClassName: string;
  selectClassName?: string;
  style?: React.CSSProperties;
}

export function EditableBadge({
  value,
  options,
  onSave,
  displayFormatter,
  badgeClassName,
  selectClassName,
  style,
}: EditableBadgeProps) {
  const [isEditing, setIsEditing] = useState(false);

  const displayValue = displayFormatter(value);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const originalValue = String(value);

    // Only save if changed
    if (newValue === originalValue) {
      cancelEditing();
      return;
    }

    try {
      // Convert to number if original value was a number
      const finalValue = typeof value === 'number' ? Number(newValue) : newValue;
      await onSave(finalValue);
      cancelEditing();
    } catch (error) {
      console.error('Error saving:', error);
      cancelEditing();
    }
  };

  if (isEditing) {
    return (
      <select
        value={value}
        onChange={handleChange}
        onBlur={cancelEditing}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            cancelEditing();
          }
        }}
        className={selectClassName || badgeClassName}
        style={style}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <button type="button" onClick={startEditing} className={badgeClassName} style={style}>
      {displayValue}
    </button>
  );
}
