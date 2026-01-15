/**
 * Profile Tab Screen
 * Uses NativeWind for styling and useAuth hook
 */

import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@profile/features";
import { useAuthStore } from "../../providers/StoresProvider";
import { tokenManager } from "../../providers/ApiProvider";

export default function ProfileScreen() {
 const router = useRouter();
 const authStore = useAuthStore();

 const { user, logout } = useAuth({
  store: authStore,
 });

 const handleLogout = async () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
   { text: "Cancel", style: "cancel" },
   {
    text: "Logout",
    style: "destructive",
    onPress: async () => {
     await logout();
     await tokenManager.clearTokens();
     router.replace("/(auth)/login");
    },
   },
  ]);
 };

 return (
  <View className="flex-1 bg-secondary-50">
   <View className="bg-white pt-10 pb-8 items-center border-b border-secondary-200">
    <View className="w-20 h-20 rounded-full bg-primary-500 justify-center items-center mb-4">
     <Text className="text-white text-3xl font-semibold">
      {user?.name?.charAt(0)?.toUpperCase() ??
       user?.username?.charAt(0)?.toUpperCase() ??
       "U"}
     </Text>
    </View>
    <Text className="text-2xl font-semibold mb-1 text-secondary-900">
     {user?.name ?? user?.username ?? "User"}
    </Text>
    <Text className="text-base text-secondary-500">
     {user?.email ?? "user@example.com"}
    </Text>
   </View>

   <View className="mt-5 px-4">
    <TouchableOpacity
     className="bg-red-500 rounded-xl p-4 items-center"
     onPress={handleLogout}
    >
     <Text className="text-white text-base font-semibold">Logout</Text>
    </TouchableOpacity>
   </View>
  </View>
 );
}
