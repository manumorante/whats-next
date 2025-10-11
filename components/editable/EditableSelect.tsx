'use client';

import { useState } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface EditableSelectProps {
  value: string | number;
  options: SelectOption[];
  onSave: (value: string | number) => Promise<void>;
  className?: string;
  selectClassName?: string;
  buttonClassName?: string;
  displayFormatter?: (value: string | number) => string;
}

export function EditableSelect({
  value,
  options,
  onSave,
  className = '',
  selectClassName = '',
  buttonClassName = '',
  displayFormatter,
}: EditableSelectProps) {
  const [isEditing, setIsEditing] = useState(false);

  const displayValue = displayFormatter
    ? displayFormatter(value)
    : options.find((opt) => opt.value === value)?.label || String(value);

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
        className={selectClassName || className}
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
    <button type="button" onClick={startEditing} className={buttonClassName || className}>
      {displayValue}
    </button>
  );
}
