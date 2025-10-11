'use client';

import { useState } from 'react';
import { useActiveContexts } from '@/hooks/useContexts';

interface QuickAddActivityProps {
  onAdd: (title: string, suggestedData: Record<string, unknown>) => Promise<void>;
}

export function QuickAddActivity({ onAdd }: QuickAddActivityProps) {
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { activeContexts } = useActiveContexts();

  const getSuggestedData = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Suggest category based on time and day
    let suggestedCategoryId = 1; // Default: Productiva
    let suggestedPriority: 'urgent' | 'important' | 'someday' = 'important';
    let suggestedEnergyLevel: 'low' | 'medium' | 'high' = 'medium';

    // Weekend = Ocio (2) or Social (3)
    if (day === 0 || day === 6) {
      suggestedCategoryId = 2; // Ocio
      suggestedPriority = 'someday';
    }

    // Early morning (6-9) = high energy
    if (hour >= 6 && hour < 9) {
      suggestedEnergyLevel = 'high';
      suggestedPriority = 'important';
    }
    // Work hours (9-18) = Productiva
    else if (hour >= 9 && hour < 18) {
      suggestedCategoryId = 1; // Productiva
      suggestedEnergyLevel = 'medium';
    }
    // Evening (18-22) = medium/low energy
    else if (hour >= 18 && hour < 22) {
      suggestedEnergyLevel = 'low';
      suggestedCategoryId = 2; // Ocio
    }
    // Night (22+) = low energy, Bienestar
    else if (hour >= 22 || hour < 6) {
      suggestedEnergyLevel = 'low';
      suggestedCategoryId = 4; // Bienestar
      suggestedPriority = 'someday';
    }

    return {
      category_id: suggestedCategoryId,
      priority: suggestedPriority,
      energy_level: suggestedEnergyLevel,
      duration_minutes: 30,
      context_ids: activeContexts?.map((c) => c.id) || [],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isAdding) return;

    setIsAdding(true);
    try {
      const suggestedData = getSuggestedData();
      await onAdd(title.trim(), suggestedData);
      setTitle('');
    } catch (error) {
      console.error('Error adding activity:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new activity..."
        disabled={isAdding}
        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors disabled:opacity-50"
      />
    </form>
  );
}
