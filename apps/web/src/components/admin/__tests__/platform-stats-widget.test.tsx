import React from 'react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';

// ── Mutable mock state ──────────────────────────────────

let mockStatsReturn: {
  data:
    | {
        totalUsers: number;
        totalResumes: number;
        activeUsersToday: number;
        activeUsersWeek: number;
      }
    | undefined;
  isLoading: boolean;
};

void mock.module('../hooks/use-platform-stats', () => ({
  usePlatformStats: () => mockStatsReturn,
}));

import { PlatformStatsWidget } from '../platform-stats-widget';

// ── Tests ───────────────────────────────────────────────

describe('PlatformStatsWidget', () => {
  beforeEach(() => {
    mockStatsReturn = {
      data: {
        totalUsers: 1_234,
        totalResumes: 5_678,
        activeUsersToday: 89,
        activeUsersWeek: 321,
      },
      isLoading: false,
    };
  });

  it('renders all four stat card labels', () => {
    render(<PlatformStatsWidget />);

    expect(screen.getByText('Total Users')).not.toBeNull();
    expect(screen.getByText('Total Resumes')).not.toBeNull();
    expect(screen.getByText('Active Today')).not.toBeNull();
    expect(screen.getByText('Active This Week')).not.toBeNull();
  });

  it('renders stat values from the hook data', () => {
    render(<PlatformStatsWidget />);

    expect(screen.getByText('1234')).not.toBeNull();
    expect(screen.getByText('5678')).not.toBeNull();
    expect(screen.getByText('89')).not.toBeNull();
    expect(screen.getByText('321')).not.toBeNull();
  });

  it('shows loading skeletons when data is loading', () => {
    mockStatsReturn = { data: undefined, isLoading: true };

    const { container } = render(<PlatformStatsWidget />);

    expect(screen.queryByText('1234')).toBeNull();
    expect(screen.queryByText('Total Users')).toBeNull();
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows zero values when data is unavailable (error state)', () => {
    mockStatsReturn = { data: undefined, isLoading: false };

    render(<PlatformStatsWidget />);

    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(4);
  });
});
