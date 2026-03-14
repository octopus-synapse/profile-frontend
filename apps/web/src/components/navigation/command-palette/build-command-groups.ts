import type { DictionaryKey } from '@profile/i18n';
import {
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Moon,
  Rocket,
  Settings,
  Sun,
  User,
  Users,
} from 'lucide-react';
import { ROUTES } from '@/config/routes';
import type { CommandGroup, CommandItem } from './types';

interface BuildCommandGroupsOptions {
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasCompletedOnboarding: boolean;
  currentTheme: 'light' | 'dark';
  currentLanguage: string;
  t: (key: DictionaryKey) => string;
  onToggleTheme: () => void;
  onCycleLanguage: () => void;
  onSignOut: () => void;
}

export function buildCommandGroups(options: BuildCommandGroupsOptions): CommandGroup[] {
  const {
    isAuthenticated,
    isAdmin,
    hasCompletedOnboarding,
    currentTheme,
    currentLanguage,
    t,
    onToggleTheme,
    onCycleLanguage,
    onSignOut,
  } = options;

  const result: CommandGroup[] = [];

  if (isAuthenticated) {
    result.push(buildNavigationGroup(t, hasCompletedOnboarding));

    if (isAdmin) {
      result.push(buildAdminGroup(t));
    }
  }

  result.push(
    buildActionsGroup({
      currentTheme,
      currentLanguage,
      isAuthenticated,
      t,
      onToggleTheme,
      onCycleLanguage,
      onSignOut,
    }),
  );

  return result;
}

function buildNavigationGroup(
  t: (key: DictionaryKey) => string,
  hasCompletedOnboarding: boolean,
): CommandGroup {
  const items: CommandItem[] = [];

  if (!hasCompletedOnboarding) {
    items.push({
      id: 'onboarding',
      label: t('nav.onboarding'),
      icon: Rocket,
      href: ROUTES.ONBOARDING,
      keywords: ['start', 'setup', 'wizard'],
    });
  }

  items.push(
    {
      id: 'profile',
      label: t('nav.profile'),
      icon: User,
      href: ROUTES.PROTECTED.PROFILE,
      keywords: ['account', 'me', 'user'],
    },
    {
      id: 'resume',
      label: t('nav.resume'),
      icon: FileText,
      href: ROUTES.PROTECTED.RESUME,
      keywords: ['cv', 'curriculum', 'document'],
    },
    {
      id: 'settings',
      label: t('nav.settings'),
      icon: Settings,
      href: ROUTES.PROTECTED.SETTINGS,
      keywords: ['preferences', 'config', 'options'],
    },
  );

  return { id: 'navigation', label: t('nav.group.main'), items };
}

function buildAdminGroup(t: (key: DictionaryKey) => string): CommandGroup {
  return {
    id: 'admin',
    label: 'Admin',
    items: [
      {
        id: 'admin-dashboard',
        label: t('nav.admin.dashboard'),
        icon: LayoutDashboard,
        href: ROUTES.ADMIN.DASHBOARD,
        keywords: ['admin', 'panel'],
      },
      {
        id: 'admin-users',
        label: t('nav.admin.users'),
        icon: Users,
        href: ROUTES.ADMIN.USERS,
        keywords: ['admin', 'manage'],
      },
    ],
  };
}

interface BuildActionsGroupOptions {
  currentTheme: 'light' | 'dark';
  currentLanguage: string;
  isAuthenticated: boolean;
  t: (key: DictionaryKey) => string;
  onToggleTheme: () => void;
  onCycleLanguage: () => void;
  onSignOut: () => void;
}

function buildActionsGroup(options: BuildActionsGroupOptions): CommandGroup {
  const {
    currentTheme,
    currentLanguage,
    isAuthenticated,
    t,
    onToggleTheme,
    onCycleLanguage,
    onSignOut,
  } = options;

  const items: CommandItem[] = [
    {
      id: 'toggle-theme',
      label: currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: currentTheme === 'dark' ? Sun : Moon,
      action: onToggleTheme,
      keywords: ['dark', 'light', 'theme', 'mode'],
    },
    {
      id: 'change-language',
      label: `Language: ${currentLanguage === 'pt-BR' ? 'Português' : 'English'}`,
      icon: Globe,
      action: onCycleLanguage,
      keywords: ['lang', 'idioma', 'english', 'portuguese'],
    },
  ];

  if (isAuthenticated) {
    items.push({
      id: 'sign-out',
      label: t('nav.signOut'),
      icon: LogOut,
      action: onSignOut,
      keywords: ['logout', 'exit', 'sair'],
    });
  }

  return { id: 'actions', label: 'Actions', items };
}
