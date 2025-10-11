import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityCard } from '@/components/ActivityCard';
import type { ActivityWithDetails } from '@/lib/types';

describe('ActivityCard Component', () => {
  const mockActivity: ActivityWithDetails = {
    id: 1,
    title: 'Test Activity',
    description: 'Test description',
    category_id: 1,
    duration_minutes: 30,
    energy_level: 'medium',
    location: 'home',
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
    expect(screen.getByText(/Test Activity/i)).toBeDefined();
  });

  it('should render activity description', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('Test description')).toBeDefined();
  });

  it('should display category badge', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('Productiva')).toBeDefined();
    expect(screen.getByText('WORK')).toBeDefined();
  });

  it('should show duration', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('30 min')).toBeDefined();
  });

  it('should show energy level', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText(/Medium/i)).toBeDefined();
  });

  it('should show location', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText(/home/i)).toBeDefined();
  });

  it('should call onToggle when checkbox clicked', async () => {
    const onToggle = vi.fn();
    const { container } = render(<ActivityCard activity={mockActivity} onToggle={onToggle} />);

    const checkbox = container.querySelector('button[type="button"]');
    expect(checkbox).toBeDefined();
  });

  it('should display completion stats when available', () => {
    const activityWithStats: ActivityWithDetails = {
      ...mockActivity,
      completions_count: 5,
      last_completed: new Date().toISOString(),
    };

    render(<ActivityCard activity={activityWithStats} />);
    expect(screen.getByText(/Completada 5 veces/i)).toBeDefined();
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

