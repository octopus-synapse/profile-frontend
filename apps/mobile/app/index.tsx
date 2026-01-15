/**
 * Index Screen
 * Landing/splash screen with auth check
 * Uses NativeWind for styling
 */

import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../providers/StoresProvider";

export default function Index() {
 const router = useRouter();
 const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
 const isLoading = useAuthStore((state) => state.isLoading);

 useEffect(() => {
  if (!isLoading) {
   if (isAuthenticated) {
    router.replace("/(tabs)");
   } else {
    router.replace("/(auth)/login");
   }
  }
 }, [isAuthenticated, isLoading, router]);

 return (
  <View className="flex-1 justify-center items-center bg-white">
   <ActivityIndicator size="large" color="#0ea5e9" />
   <Text className="mt-5 text-2xl font-bold text-secondary-900">Profile</Text>
  </View>
 );
}
