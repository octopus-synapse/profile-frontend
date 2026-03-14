/**
 * English dictionary - aggregates all en modules
 */

import { admin } from './admin';
import { app } from './app';
import { auth } from './auth';
import { common } from './common';
import { landing } from './landing';
import { navigation } from './navigation';

export const en = {
  ...common,
  ...navigation,
  ...auth,
  ...admin,
  ...landing,
  ...app,
} as const;

export type Dictionary = typeof en;
export type DictionaryKey = keyof Dictionary;
