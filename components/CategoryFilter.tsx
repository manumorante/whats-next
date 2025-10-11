'use client';

import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: number | undefined;
  onSelectCategory: (categoryId: number | undefined) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-24 bg-neutral-800 rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* All categories button */}
      <button
        type="button"
        onClick={() => onSelectCategory(undefined)}
        className={cn(
          'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
          selectedCategory === undefined
            ? 'bg-neutral-700 text-neutral-100'
            : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
        )}
      >
        All
      </button>

      {/* Category buttons */}
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5',
            selectedCategory === category.id
              ? 'text-neutral-100'
              : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
          )}
          style={{
            backgroundColor: selectedCategory === category.id ? category.color : undefined,
          }}
        >
          {category.icon && <span>{category.icon}</span>}
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}
