import type {
  OnboardingSessionDto,
  OnboardingSessionDtoPersonalInfo,
  OnboardingSessionDtoProfessionalProfile,
  OnboardingSessionDtoSectionsItem,
  OnboardingSessionDtoStepsItem,
  OnboardingSessionDtoStepsItemFieldsItem,
  OnboardingSessionDtoTemplateSelection,
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

// Re-export types with shorter aliases for convenience
export type { OnboardingSessionDto };
export type StepMetaDto = OnboardingSessionDtoStepsItem;
export type StepFieldDto = OnboardingSessionDtoStepsItemFieldsItem;
export type PersonalInfo = OnboardingSessionDtoPersonalInfo;
export type ProfessionalProfile = OnboardingSessionDtoProfessionalProfile;
export type TemplateSelection = OnboardingSessionDtoTemplateSelection;
export type SectionProgressDto = OnboardingSessionDtoSectionsItem;
export type SectionItem = { id?: string; content: Record<string, unknown> };
export type SectionData = Omit<SectionProgressDto, 'items'> & {
  sectionTypeKey: string;
  items: SectionItem[];
};
