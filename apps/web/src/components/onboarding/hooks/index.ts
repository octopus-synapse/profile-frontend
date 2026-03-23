import type {
  OnboardingPersonalInfoDto,
  OnboardingProfessionalProfileDto,
  OnboardingSessionDto,
  OnboardingTemplateSelectionDto,
  SectionProgressDto,
  StepFieldDto,
  StepMetaDto,
} from '@profile/api-client';

export { useGitHubUser } from './use-github-user';
export { useOnboarding } from './use-onboarding';

export type KnownStep =
  | 'welcome'
  | 'personal-info'
  | 'username'
  | 'professional-profile'
  | 'template'
  | 'review'
  | 'complete';
export type OnboardingStep = KnownStep | SectionStep | (string & {});
export type SectionStep = `section:${string}`;
export const isSectionStep = (step: string): step is SectionStep => step.startsWith('section:');
export const getSectionTypeFromStep = (step: SectionStep | string) => step.replace('section:', '');

export type { OnboardingSessionDto, StepMetaDto, StepFieldDto };
export type PersonalInfo = OnboardingPersonalInfoDto;
export type ProfessionalProfile = OnboardingProfessionalProfileDto;
export type TemplateSelection = OnboardingTemplateSelectionDto;
export type SectionItem = { id?: string; content: Record<string, unknown> };
export type SectionData = Omit<SectionProgressDto, 'items'> & {
  items: SectionItem[];
};
