import { describe, expect, it } from 'bun:test';
import {
  getProfessionalProfileSummary,
  isProfessionalProfileComplete,
} from '../review-step.utils';

describe('review-step utils', () => {
  it('treats professional profile as complete only when jobTitle and summary exist', () => {
    expect(
      isProfessionalProfileComplete({
        jobTitle: 'Senior Engineer',
        summary: 'Experienced engineer building reliable products.',
      }),
    ).toBe(true);

    expect(
      isProfessionalProfileComplete({
        summary: 'Experienced engineer building reliable products.',
      }),
    ).toBe(false);
  });

  it('uses jobTitle as the summary preview value', () => {
    expect(
      getProfessionalProfileSummary({
        jobTitle: 'Senior Engineer',
        summary: 'Experienced engineer building reliable products.',
      }),
    ).toBe('Senior Engineer');
  });
});
