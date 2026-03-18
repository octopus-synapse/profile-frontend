import { describe, expect, it } from 'bun:test';
import { extractResumeListItems } from '../resume-builder.utils';

describe('extractResumeListItems', () => {
  it('returns resumes from the paginated SDK response shape', () => {
    const result = extractResumeListItems({
      data: {
        data: [{ id: 'resume-1' }, { id: 'resume-2' }],
      },
    });

    expect(result).toEqual([{ id: 'resume-1' }, { id: 'resume-2' }]);
  });

  it('returns an empty list when the response has no resumes', () => {
    expect(extractResumeListItems(undefined)).toEqual([]);
    expect(
      extractResumeListItems({
        data: {},
      }),
    ).toEqual([]);
  });
});
