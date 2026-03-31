/**
 * Portuguese (Brazil) dictionary - aggregates all pt-BR modules
 */

import { admin } from './admin';
import { app } from './app';
import { auth } from './auth';
import { common } from './common';
import { landing } from './landing';
import { navigation } from './navigation';
import { onboarding } from './onboarding';
import { resume } from './resume';
import { settings } from './settings';
import { social } from './social';

export const ptBR = {
  ...common,
  ...navigation,
  ...auth,
  ...admin,
  ...landing,
  ...app,
  ...onboarding,
  ...social,
  ...resume,
  ...settings,
} as const;
