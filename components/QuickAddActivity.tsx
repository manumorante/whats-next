'use client';

import { useState } from 'react';
import { useActiveContexts } from '@/hooks/useContexts';
import type { EnergyLevel, Priority } from '@/lib/types';

type SuggestedDefaults = {
  category_id: number;
  priority: Priority;
  energy_level: EnergyLevel;
};

type SuggestionRule = {
  matches: (context: { day: number; hour: number }) => boolean;
  apply: Partial<SuggestedDefaults>;
};

const DEFAULT_SUGGESTION: SuggestedDefaults = {
  category_id: 1,
  priority: 'important',
  energy_level: 'medium',
};

const SUGGESTION_RULES: SuggestionRule[] = [
  {
    matches: ({ day }) => day === 0 || day === 6,
    apply: { category_id: 2, priority: 'someday' },
  },
  {
    matches: ({ hour }) => hour >= 6 && hour < 9,
    apply: { energy_level: 'high', priority: 'important' },
  },
  {
    matches: ({ hour }) => hour >= 9 && hour < 18,
    apply: { category_id: 1, energy_level: 'medium' },
  },
  {
    matches: ({ hour }) => hour >= 18 && hour < 22,
    apply: { energy_level: 'low', category_id: 2 },
  },
  {
    matches: ({ hour }) => hour >= 22 || hour < 6,
    apply: { energy_level: 'low', category_id: 4, priority: 'someday' },
  },
];

interface QuickAddActivityProps {
  onAdd: (title: string, suggestedData: Record<string, unknown>) => Promise<void>;
}

export function QuickAddActivity({ onAdd }: QuickAddActivityProps) {
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { activeContexts } = useActiveContexts();

  const getSuggestedData = () => {
    const now = new Date();
    const context = { day: now.getDay(), hour: now.getHours() };
    const suggestion: SuggestedDefaults = { ...DEFAULT_SUGGESTION };

    for (const rule of SUGGESTION_RULES) {
      if (rule.matches(context)) {
        Object.assign(suggestion, rule.apply);
      }
    }

    return {
      ...suggestion,
      context_ids: activeContexts.map((contextItem) => contextItem.id),
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
        placeholder="Añadir nueva actividad..."
        disabled={isAdding}
        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors disabled:opacity-50"
      />
    </form>
  );
}
