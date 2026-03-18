import { describe, expect, it } from 'bun:test';
import {
  createEmptyResumeBasicsForm,
  toResumeBasicsForm,
  toUpdateResumePayload,
} from '../resume-basics-section.utils';

describe('resume basics form helpers', () => {
  it('maps resume snapshot fields into the settings form shape', () => {
    expect(
      toResumeBasicsForm({
        title: 'Senior Resume',
        fullName: 'Enzo Ferracini Patti',
        email: 'enzo@example.com',
        phone: '+55 11 99999-9999',
        location: 'Sao Paulo, BR',
        summary: 'Backend-driven profile.',
        targetRole: 'Senior Software Engineer',
      }),
    ).toEqual({
      title: 'Senior Resume',
      fullName: 'Enzo Ferracini Patti',
      emailContact: 'enzo@example.com',
      phone: '+55 11 99999-9999',
      location: 'Sao Paulo, BR',
      summary: 'Backend-driven profile.',
      jobTitle: 'Senior Software Engineer',
    });
  });

  it('creates an empty form and keeps the update payload aligned with backend keys', () => {
    const emptyForm = createEmptyResumeBasicsForm();

    expect(emptyForm).toEqual({
      title: '',
      fullName: '',
      emailContact: '',
      phone: '',
      location: '',
      summary: '',
      jobTitle: '',
    });

    expect(
      toUpdateResumePayload({
        ...emptyForm,
        jobTitle: 'Platform Engineer',
      }),
    ).toEqual({
      title: '',
      fullName: '',
      emailContact: '',
      phone: '',
      location: '',
      summary: '',
      jobTitle: 'Platform Engineer',
    });
  });
});
