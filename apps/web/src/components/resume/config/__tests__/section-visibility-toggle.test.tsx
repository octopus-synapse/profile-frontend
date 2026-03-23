import React from 'react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SectionVisibilityToggle } from '../section-visibility-toggle';

describe('SectionVisibilityToggle', () => {
  const baseProps = {
    resumeId: 'resume-1',
    sectionId: 'section-1',
    visible: true,
    label: 'Work Experience',
    onToggle: mock(() => Promise.resolve()),
  };

  beforeEach(() => {
    baseProps.onToggle = mock(() => Promise.resolve());
  });

  it('renders the label text', () => {
    render(<SectionVisibilityToggle {...baseProps} />);

    expect(screen.getByText('Work Experience')).not.toBeNull();
  });

  it('shows Eye icon when visible is true', () => {
    render(<SectionVisibilityToggle {...baseProps} visible={true} />);

    expect(screen.getByTestId('icon-eye')).not.toBeNull();
  });

  it('shows EyeOff icon when visible is false', () => {
    render(<SectionVisibilityToggle {...baseProps} visible={false} />);

    expect(screen.getByTestId('icon-eye-off')).not.toBeNull();
  });

  it('calls onToggle with sectionId and new visibility on click', () => {
    render(<SectionVisibilityToggle {...baseProps} visible={true} />);

    fireEvent.click(screen.getByRole('button'));

    expect(baseProps.onToggle).toHaveBeenCalledWith('section-1', false);
  });

  it('calls onToggle to show section when currently hidden', () => {
    render(<SectionVisibilityToggle {...baseProps} visible={false} />);

    fireEvent.click(screen.getByRole('button'));

    expect(baseProps.onToggle).toHaveBeenCalledWith('section-1', true);
  });

  it('disables button while pending', async () => {
    const onToggle = mock(() => new Promise<void>(() => {}));
    render(<SectionVisibilityToggle {...baseProps} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        (screen.getByRole('button') as HTMLButtonElement).disabled,
      ).toBe(true);
    });
  });

  it('reverts to original visible state if onToggle rejects', async () => {
    const onToggle = mock(() => Promise.reject(new Error('network error')));
    render(
      <SectionVisibilityToggle {...baseProps} visible={true} onToggle={onToggle} />,
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByLabelText('Hide Work Experience')).not.toBeNull();
    });
  });

  it('re-enables button after onToggle completes', async () => {
    render(<SectionVisibilityToggle {...baseProps} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        (screen.getByRole('button') as HTMLButtonElement).disabled,
      ).toBe(false);
    });
  });
});
