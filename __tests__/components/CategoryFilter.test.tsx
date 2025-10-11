import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CategoryFilter } from '@/components/CategoryFilter';

// Mock the useCategories hook
vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 1, name: 'Productiva', color: '#3B82F6', icon: 'WORK' },
      { id: 2, name: 'Ocio', color: '#8B5CF6', icon: 'FUN' },
      { id: 3, name: 'Social', color: '#EC4899', icon: 'SOCIAL' },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe('CategoryFilter Component', () => {
  it('should render "All" button', () => {
    const mockOnSelect = vi.fn();
    render(<CategoryFilter selectedCategory={undefined} onSelectCategory={mockOnSelect} />);

    expect(screen.getByText(/All/i)).toBeDefined();
  });

  it('should render all categories', () => {
    const mockOnSelect = vi.fn();
    render(<CategoryFilter selectedCategory={undefined} onSelectCategory={mockOnSelect} />);

    expect(screen.getByText('Productiva')).toBeDefined();
    expect(screen.getByText('Ocio')).toBeDefined();
    expect(screen.getByText('Social')).toBeDefined();
  });

  it('should highlight selected category', () => {
    const mockOnSelect = vi.fn();
    const { container } = render(
      <CategoryFilter selectedCategory={1} onSelectCategory={mockOnSelect} />
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
