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
import { Button, Input } from "@octopus-synapse/profile-ui";
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
     placeholder="Password"
     value={password}
     onChangeText={setPassword}
     disabled={isLoading}
     textInputProps={{
      secureTextEntry: true,
     }}
    />

    <View className="h-6" />

    <Button
     variant="primary"
     loading={isLoading}
     onPress={handleLogin}
     disabled={isLoading}
     fullWidth
    >
     Login
    </Button>

    <View className="h-4" />

    <Button variant="ghost" onPress={() => router.push("/(auth)/register")}>
     Don't have an account? Register
    </Button>
   </View>
  </KeyboardAvoidingView>
 );
}
