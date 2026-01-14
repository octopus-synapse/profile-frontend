/**
 * Login Screen
 */

import { useState } from "react";
import {
 View,
 Text,
 TextInput,
 TouchableOpacity,
 StyleSheet,
 Alert,
 KeyboardAvoidingView,
 Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../providers/StoresProvider";
import { tokenManager } from "../../providers/ApiProvider";

export default function LoginScreen() {
 const router = useRouter();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");

 const login = useAuthStore((state) => state.login);
 const isLoading = useAuthStore((state) => state.isLoading);

 const handleLogin = async () => {
  if (!email || !password) {
   Alert.alert("Error", "Please fill in all fields");
   return;
  }

  try {
   await login(email, password);

   // Get tokens from store and save to secure storage
   const tokens = useAuthStore.getState().tokens;
   if (tokens) {
    await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
   }

   router.replace("/(tabs)");
  } catch (error) {
   Alert.alert(
    "Login Failed",
    error instanceof Error ? error.message : "An error occurred"
   );
  }
 };

 return (
  <KeyboardAvoidingView
   behavior={Platform.OS === "ios" ? "padding" : "height"}
   style={styles.container}
  >
   <View style={styles.form}>
    <Text style={styles.title}>Welcome Back</Text>
    <Text style={styles.subtitle}>Login to your account</Text>

    <TextInput
     style={styles.input}
     placeholder="Email"
     value={email}
     onChangeText={setEmail}
     autoCapitalize="none"
     keyboardType="email-address"
     editable={!isLoading}
    />

    <TextInput
     style={styles.input}
     placeholder="Password"
     value={password}
     onChangeText={setPassword}
     secureTextEntry
     editable={!isLoading}
    />

    <TouchableOpacity
     style={[styles.button, isLoading && styles.buttonDisabled]}
     onPress={handleLogin}
     disabled={isLoading}
    >
     <Text style={styles.buttonText}>{isLoading ? "Loading..." : "Login"}</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
     <Text style={styles.link}>Don't have an account? Register</Text>
    </TouchableOpacity>
   </View>
  </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#fff",
 },
 form: {
  flex: 1,
  justifyContent: "center",
  padding: 20,
 },
 title: {
  fontSize: 32,
  fontWeight: "bold",
  marginBottom: 10,
  textAlign: "center",
 },
 subtitle: {
  fontSize: 16,
  color: "#666",
  marginBottom: 30,
  textAlign: "center",
 },
 input: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 15,
  marginBottom: 15,
  fontSize: 16,
 },
 button: {
  backgroundColor: "#007AFF",
  borderRadius: 8,
  padding: 15,
  alignItems: "center",
  marginTop: 10,
 },
 buttonDisabled: {
  opacity: 0.6,
 },
 buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
 },
 link: {
  color: "#007AFF",
  textAlign: "center",
  marginTop: 20,
  fontSize: 14,
 },
});
