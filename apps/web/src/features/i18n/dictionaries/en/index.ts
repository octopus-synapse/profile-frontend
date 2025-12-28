/**
 * English dictionary - aggregates all en modules
 */

import { common } from "./common";
import { navigation } from "./navigation";
import { auth } from "./auth";
import { admin } from "./admin";

export const en = {
 ...common,
 ...navigation,
 ...auth,
 ...admin,
} as const;

export type Dictionary = typeof en;
export type DictionaryKey = keyof Dictionary;
