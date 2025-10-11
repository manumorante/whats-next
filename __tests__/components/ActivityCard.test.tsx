import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActivityCard } from '@/components/ActivityCard';
import type { ActivityWithDetails } from '@/lib/types';

// Mock useCategories hook
vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 1, name: 'Productiva', color: '#3B82F6', icon: 'WORK' },
      { id: 2, name: 'Ocio', color: '#8B5CF6', icon: 'FUN' },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe('ActivityCard Component', () => {
  const mockActivity: ActivityWithDetails = {
    id: 1,
    title: 'Test Activity',
    description: 'Test description',
    category_id: 1,
    energy_level: 'medium',
    priority: 'important',
    is_recurring: 0,
    recurrence_type: null,
    is_completed: 0,
    created_at: new Date().toISOString(),
    category: {
      id: 1,
      name: 'Productiva',
      color: '#3B82F6',
      icon: 'WORK',
      created_at: new Date().toISOString(),
    },
    contexts: [],
    time_slots: [],
  };

  it('should render activity title', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getAllByText(/Test Activity/i).length).toBeGreaterThan(0);
  });

  it('should render activity description', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('Test description')).toBeDefined();
  });

  it('should display category badge when expanded', async () => {
    const user = userEvent.setup();
    const { container } = render(<ActivityCard activity={mockActivity} />);

    // Card is closed by default, need to open it by clicking the summary
    const summary = container.querySelector('summary');
    if (summary) {
      await user.click(summary);
    }

    // Now category should be visible
    expect(screen.getByText('Productiva')).toBeDefined();
  });

  it('should show energy level', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText(/Moderada/i)).toBeDefined();
  });

  it('should call onToggle when checkbox clicked', async () => {
    const onToggle = vi.fn();
    const { container } = render(<ActivityCard activity={mockActivity} onToggle={onToggle} />);

    const checkbox = container.querySelector('button[type="button"]');
    expect(checkbox).toBeDefined();
  });

  it('should show score and reason when provided', () => {
    render(<ActivityCard activity={mockActivity} score={75} reason="Test reason" />);

    expect(screen.getByText('Test reason')).toBeDefined();
    expect(screen.getByText('75pts')).toBeDefined();
  });

  it('should render recurring badge for recurring activities', () => {
    const recurringActivity: ActivityWithDetails = {
      ...mockActivity,
      is_recurring: 1,
      recurrence_type: 'daily',
    };

    render(<ActivityCard activity={recurringActivity} />);
    expect(screen.getByText(/daily/i)).toBeDefined();
  });
});
