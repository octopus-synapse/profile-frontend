/**
 * Portuguese (Brazil) dictionary - aggregates all pt-BR modules
 */

import { common } from "./common";
import { navigation } from "./navigation";
import { auth } from "./auth";
import { admin } from "./admin";

export const ptBR = {
  ...common,
  ...navigation,
  ...auth,
  ...admin,
} as const;
