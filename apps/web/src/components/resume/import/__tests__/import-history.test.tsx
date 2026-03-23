import React from 'react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import type { ImportJob } from '../../hooks/use-resume-import';

// ── Mutable mock state ──────────────────────────────────

let mockHistoryReturn: {
  data: ImportJob[] | undefined;
  isLoading: boolean;
};

void mock.module('../../hooks/use-resume-import', () => ({
  useImportHistory: () => mockHistoryReturn,
  useCancelImport: () => ({ mutateAsync: mock(), isPending: false }),
  useRetryImport: () => ({ mutateAsync: mock(), isPending: false }),
}));

import { ImportHistory } from '../import-history';

// ── Fixtures ────────────────────────────────────────────

const sampleJobs: ImportJob[] = [
  {
    id: 'j1',
    importId: 'imp-aaaa-1111',
    userId: 'u1',
    source: 'JSON',
    status: 'COMPLETED',
    resumeId: 'r1',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'j2',
    importId: 'imp-bbbb-2222',
    userId: 'u1',
    source: 'PDF',
    status: 'PENDING',
    createdAt: '2024-01-16T12:00:00Z',
  },
  {
    id: 'j3',
    importId: 'imp-cccc-3333',
    userId: 'u1',
    source: 'DOCX',
    status: 'FAILED',
    errors: ['Parse error'],
    createdAt: '2024-01-17T08:00:00Z',
  },
];

// ── Tests ───────────────────────────────────────────────

describe('ImportHistory', () => {
  beforeEach(() => {
    mockHistoryReturn = { data: sampleJobs, isLoading: false };
  });

  it('renders the heading when jobs exist', () => {
    render(<ImportHistory />);

    expect(screen.getByText('Import History')).not.toBeNull();
  });

  it('shows each job with its truncated import id', () => {
    render(<ImportHistory />);

    expect(screen.getByText('imp-aaaa…')).not.toBeNull();
    expect(screen.getByText('imp-bbbb…')).not.toBeNull();
    expect(screen.getByText('imp-cccc…')).not.toBeNull();
  });

  it('shows correct status badges for each job', () => {
    render(<ImportHistory />);

    expect(screen.getByText('Completed')).not.toBeNull();
    expect(screen.getByText('Pending')).not.toBeNull();
    expect(screen.getByText('Failed')).not.toBeNull();
  });

  it('shows "View Resume" link for completed jobs', () => {
    render(<ImportHistory />);

    const link = screen.getByText('View Resume');
    expect(link).not.toBeNull();
  });

  it('shows retry button for failed jobs', () => {
    render(<ImportHistory />);

    expect(screen.getByText('Retry')).not.toBeNull();
  });

  it('shows cancel button for pending jobs', () => {
    render(<ImportHistory />);

    expect(screen.getByText('Cancel')).not.toBeNull();
  });

  it('shows empty state when no jobs exist', () => {
    mockHistoryReturn = { data: [], isLoading: false };

    render(<ImportHistory />);

    expect(screen.getByText('No imports yet')).not.toBeNull();
    expect(
      screen.getByText('Import a resume to see your history here.'),
    ).not.toBeNull();
  });

  it('shows loading skeletons when isLoading is true', () => {
    mockHistoryReturn = { data: undefined, isLoading: true };

    render(<ImportHistory />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.queryByText('Import History')).toBeNull();
  });
});
