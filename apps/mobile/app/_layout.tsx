/**
 * Root Layout with expo-router
 * Sets up navigation structure and providers
 */

import "../global.css";

import { Slot } from "expo-router";
import { ApiProvider } from "../providers/ApiProvider";
import { StoresProvider } from "../providers/StoresProvider";

export default function RootLayout() {
 return (
  <ApiProvider>
   <StoresProvider>
    <Slot />
   </StoresProvider>
  </ApiProvider>
 );
}
