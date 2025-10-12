'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/Badge';
import type { SelectOption } from './types';

interface EditableBadgeProps {
  value: string | number;
  options: SelectOption[];
  onSave: (value: string | number) => Promise<void>;
  displayFormatter: (value: string | number) => string;
  isEditMode?: boolean;
  onEditComplete?: () => void;
}

export function EditableBadge({
  value,
  options,
  onSave,
  displayFormatter,
  isEditMode = false,
  onEditComplete,
}: EditableBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const displayValue = displayFormatter(value);

  const handleClick = () => {
    if (!isEditMode) return;
    setIsOpen(!isOpen);
  };

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        onEditComplete?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onEditComplete]);

  const handleSelect = async (selectedValue: string | number) => {
    const originalValue = String(value);
    const newValueStr = String(selectedValue);

    // Only save if changed
    if (newValueStr === originalValue) {
      setIsOpen(false);
      return;
    }

    try {
      // Convert to number if original value was a number
      const finalValue = typeof value === 'number' ? Number(selectedValue) : selectedValue;
      setIsOpen(false);
      onEditComplete?.();
      await onSave(finalValue);
    } catch (error) {
      console.error('Error saving:', error);
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {/* Current badge */}
      <Badge
        {...(isEditMode && {
          onClick: (e) => {
            e.stopPropagation();
            handleClick();
          },
        })}
      >
        {displayValue}
      </Badge>

      {/* Dropdown with other badges */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-neutral-900 border border-neutral-700 rounded shadow-lg py-1 min-w-max flex flex-col gap-1">
          {options.map((option) => (
            <Badge
              key={option.value}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option.value);
              }}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
