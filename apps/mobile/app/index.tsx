/**
 * Index Screen
 * Entry point with auth and onboarding check
 * Redirects to: intro → auth → onboarding → app
 */

import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../providers/StoresProvider";

const INTRO_SEEN_KEY = "@patch_intro_seen";

export default function Index() {
 const router = useRouter();
 const [isChecking, setIsChecking] = useState(true);
 const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
 const isLoading = useAuthStore((state) => state.isLoading);
 const user = useAuthStore((state) => state.user);

 useEffect(() => {
  const checkFlow = async () => {
   try {
    // 1. Check if intro was seen
    const introSeen = await AsyncStorage.getItem(INTRO_SEEN_KEY);

    if (!introSeen) {
     // First time user - show intro slides
     router.replace("/(onboarding)/intro");
     return;
    }

    // 2. Check authentication
    if (isLoading) return; // Wait for auth to load

    if (!isAuthenticated) {
     // Not logged in - go to login
     router.replace("/(auth)/login");
     return;
    }

    // 3. Check onboarding completion
    // The user object should have hasCompletedOnboarding from the JWT
    const hasCompletedOnboarding = user?.hasCompletedOnboarding ?? false;

    if (!hasCompletedOnboarding) {
     // Need to complete onboarding
     router.replace("/(onboarding)/steps");
     return;
    }

    // 4. All good - go to main app
    router.replace("/(tabs)");
   } catch (error) {
    console.error("Error checking flow:", error);
    // On error, start fresh with intro
    router.replace("/(onboarding)/intro");
   } finally {
    setIsChecking(false);
   }
  };

  checkFlow();
 }, [isAuthenticated, isLoading, user, router]);

 return (
  <View className="flex-1 justify-center items-center bg-secondary-900">
   <ActivityIndicator size="large" color="#0ea5e9" />
   <Text className="mt-5 text-2xl font-bold text-white">Patch Careers</Text>
   <Text className="mt-2 text-sm text-white/60">Loading...</Text>
  </View>
 );
}
