/**
 * Login Screen
 * Uses NativeWind for styling and useAuth hook for authentication
 */

import { useState } from "react";
import {
 View,
 Text,
 TextInput,
 TouchableOpacity,
 Alert,
 KeyboardAvoidingView,
 Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@profile/features";
import { useAuthStore } from "../../providers/StoresProvider";
import { tokenManager } from "../../providers/ApiProvider";

export default function LoginScreen() {
 const router = useRouter();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const authStore = useAuthStore();

 const { isLoading, error, login, clearError } = useAuth({
  store: authStore,
  onSuccess: async () => {
   // Get tokens from store and save to secure storage
   const tokens = useAuthStore.getState().tokens;
   if (tokens) {
    await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
   }
   router.replace("/(tabs)");
  },
  onError: (err) => {
   Alert.alert("Login Failed", err);
  },
 });

 const handleLogin = async () => {
  if (!email || !password) {
   Alert.alert("Error", "Please fill in all fields");
   return;
  }

  clearError();
  await login(email, password);
 };

 return (
  <KeyboardAvoidingView
   behavior={Platform.OS === "ios" ? "padding" : "height"}
   className="flex-1 bg-white"
  >
   <View className="flex-1 justify-center px-5">
    <Text className="text-3xl font-bold mb-2 text-center text-secondary-900">
     Welcome Back
    </Text>
    <Text className="text-base text-secondary-500 mb-8 text-center">
     Login to your account
    </Text>

    <TextInput
     className="border border-secondary-200 rounded-lg p-4 mb-4 text-base bg-white"
     placeholder="Email"
     placeholderTextColor="#94a3b8"
     value={email}
     onChangeText={setEmail}
     autoCapitalize="none"
     keyboardType="email-address"
     editable={!isLoading}
    />

    <TextInput
     className="border border-secondary-200 rounded-lg p-4 mb-4 text-base bg-white"
     placeholder="Password"
     placeholderTextColor="#94a3b8"
     value={password}
     onChangeText={setPassword}
     secureTextEntry
     editable={!isLoading}
    />

    <TouchableOpacity
     className={`bg-primary-500 rounded-lg p-4 items-center mt-2 ${
      isLoading ? "opacity-60" : ""
     }`}
     onPress={handleLogin}
     disabled={isLoading}
    >
     <Text className="text-white text-base font-semibold">
      {isLoading ? "Loading..." : "Login"}
     </Text>
    </TouchableOpacity>

    <TouchableOpacity
     onPress={() => router.push("/(auth)/register")}
     className="mt-5"
    >
     <Text className="text-primary-500 text-center text-sm">
      Don't have an account? Register
     </Text>
    </TouchableOpacity>
   </View>
  </KeyboardAvoidingView>
 );
}
