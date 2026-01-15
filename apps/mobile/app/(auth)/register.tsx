/**
 * Register Screen
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
 ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@profile/features";
import { useAuthStore } from "../../providers/StoresProvider";
import { tokenManager } from "../../providers/ApiProvider";

export default function RegisterScreen() {
 const router = useRouter();
 const [email, setEmail] = useState("");
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const authStore = useAuthStore();

 const { isLoading, register, clearError } = useAuth({
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
   Alert.alert("Registration Failed", err);
  },
 });

 const handleRegister = async () => {
  if (!email || !username || !password || !confirmPassword) {
   Alert.alert("Error", "Please fill in all fields");
   return;
  }

  if (password !== confirmPassword) {
   Alert.alert("Error", "Passwords do not match");
   return;
  }

  if (password.length < 8) {
   Alert.alert("Error", "Password must be at least 8 characters");
   return;
  }

  clearError();
  await register(email, password, username);
 };

 return (
  <KeyboardAvoidingView
   behavior={Platform.OS === "ios" ? "padding" : "height"}
   className="flex-1 bg-white"
  >
   <ScrollView contentContainerClassName="flex-grow">
    <View className="flex-1 justify-center px-5 py-10">
     <Text className="text-3xl font-bold mb-2 text-center text-secondary-900">
      Create Account
     </Text>
     <Text className="text-base text-secondary-500 mb-8 text-center">
      Sign up to get started
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
      placeholder="Username"
      placeholderTextColor="#94a3b8"
      value={username}
      onChangeText={setUsername}
      autoCapitalize="none"
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

     <TextInput
      className="border border-secondary-200 rounded-lg p-4 mb-4 text-base bg-white"
      placeholder="Confirm Password"
      placeholderTextColor="#94a3b8"
      value={confirmPassword}
      onChangeText={setConfirmPassword}
      secureTextEntry
      editable={!isLoading}
     />

     <TouchableOpacity
      className={`bg-primary-500 rounded-lg p-4 items-center mt-2 ${
       isLoading ? "opacity-60" : ""
      }`}
      onPress={handleRegister}
      disabled={isLoading}
     >
      <Text className="text-white text-base font-semibold">
       {isLoading ? "Creating..." : "Register"}
      </Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={() => router.back()} className="mt-5">
      <Text className="text-primary-500 text-center text-sm">
       Already have an account? Login
      </Text>
     </TouchableOpacity>
    </View>
   </ScrollView>
  </KeyboardAvoidingView>
 );
}
