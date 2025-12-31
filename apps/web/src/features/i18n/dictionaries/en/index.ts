/**
 * English dictionary - aggregates all en modules
 */

import { common } from "./common";
import { navigation } from "./navigation";
import { auth } from "./auth";
import { admin } from "./admin";
import { landing } from "./landing";
import { app } from "./app";

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
