/**
 * Spanish dictionary - aggregates all es modules
 */

import { common } from "./common";
import { navigation } from "./navigation";
import { auth } from "./auth";
import { admin } from "./admin";

export const es = {
  ...common,
  ...navigation,
  ...auth,
  ...admin,
} as const;
