import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivityCard } from '@/components/ActivityCard';
import type { Activity } from '@/types';

describe('ActivityCard Component', () => {
  const mockActivity: Activity = {
    id: 1,
    title: 'Test Activity',
    category: 1,
    energy: 2,
    priority: 2,
    contexts: [],
  };

  it('should render activity title', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('Test Activity')).toBeDefined();
  });

  it('should display category name', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('General')).toBeDefined();
  });

  it('should show energy level', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('Media energía')).toBeDefined();
  });

  it('should show priority level', () => {
    render(<ActivityCard activity={mockActivity} />);
    expect(screen.getByText('Media prioridad')).toBeDefined();
  });

  it('should show score and reasons when provided', () => {
    render(
      <ActivityCard
        activity={mockActivity}
        score={75}
        reasons={['Test reason 1', 'Test reason 2']}
      />
    );

    expect(screen.getByText('Test reason 1')).toBeDefined();
    expect(screen.getByText('Test reason 2')).toBeDefined();
    expect(screen.getByText('75 puntos')).toBeDefined();
  });
});
