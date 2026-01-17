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
import { Button, Input } from "@octopus-synapse/profile-ui";
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

     <Input
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      disabled={isLoading}
      textInputProps={{
       autoCapitalize: "none",
       keyboardType: "email-address",
      }}
     />

     <View className="h-4" />

     <Input
      placeholder="Username"
      value={username}
      onChangeText={setUsername}
      disabled={isLoading}
      textInputProps={{
       autoCapitalize: "none",
      }}
     />

     <View className="h-4" />

     <Input
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      disabled={isLoading}
      textInputProps={{
       secureTextEntry: true,
      }}
     />

     <View className="h-4" />

     <Input
      placeholder="Confirm Password"
      value={confirmPassword}
      onChangeText={setConfirmPassword}
      disabled={isLoading}
      textInputProps={{
       secureTextEntry: true,
      }}
     />

     <View className="h-6" />

     <Button
      variant="primary"
      loading={isLoading}
      onPress={handleRegister}
      disabled={isLoading}
      fullWidth
     >
      Register
     </Button>

     <View className="h-4" />

     <Button variant="ghost" onPress={() => router.back()}>
      Already have an account? Login
     </Button>
    </View>
   </ScrollView>
  </KeyboardAvoidingView>
 );
}
