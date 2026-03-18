import type { UpdateResume } from '@profile/api-client';

export interface ResumeBasicsSnapshot {
  title?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  targetRole?: string;
}

export interface ResumeBasicsFormData {
  title: string;
  fullName: string;
  emailContact: string;
  phone: string;
  location: string;
  summary: string;
  jobTitle: string;
}

export function createEmptyResumeBasicsForm(): ResumeBasicsFormData {
  return {
    title: '',
    fullName: '',
    emailContact: '',
    phone: '',
    location: '',
    summary: '',
    jobTitle: '',
  };
}

export function toResumeBasicsForm(snapshot?: ResumeBasicsSnapshot): ResumeBasicsFormData {
  return {
    title: snapshot?.title ?? '',
    fullName: snapshot?.fullName ?? '',
    emailContact: snapshot?.email ?? '',
    phone: snapshot?.phone ?? '',
    location: snapshot?.location ?? '',
    summary: snapshot?.summary ?? '',
    jobTitle: snapshot?.targetRole ?? '',
  };
}

export function toUpdateResumePayload(form: ResumeBasicsFormData): UpdateResume {
  return {
    title: form.title,
    fullName: form.fullName,
    emailContact: form.emailContact,
    phone: form.phone,
    location: form.location,
    summary: form.summary,
    jobTitle: form.jobTitle,
  };
}
