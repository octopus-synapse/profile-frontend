/**
 * Portuguese (Brazil) dictionary - aggregates all pt-BR modules
 */

import { common } from "./common";
import { navigation } from "./navigation";
import { auth } from "./auth";
import { admin } from "./admin";
import { landing } from "./landing";
import { app } from "./app";

export const ptBR = {
  ...common,
  ...navigation,
  ...auth,
  ...admin,
  ...landing,
  ...app,
} as const;
