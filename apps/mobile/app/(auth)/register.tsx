/**
 * Register Screen
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
 ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../providers/StoresProvider";
import { tokenManager } from "../../providers/ApiProvider";

export default function RegisterScreen() {
 const router = useRouter();
 const [email, setEmail] = useState("");
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");

 const register = useAuthStore((state) => state.register);
 const isLoading = useAuthStore((state) => state.isLoading);

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

  try {
   await register(email, password, username);

   // Get tokens from store and save to secure storage
   const tokens = useAuthStore.getState().tokens;
   if (tokens) {
    await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
   }

   router.replace("/(tabs)");
  } catch (error) {
   Alert.alert(
    "Registration Failed",
    error instanceof Error ? error.message : "An error occurred"
   );
  }
 };

 return (
  <KeyboardAvoidingView
   behavior={Platform.OS === "ios" ? "padding" : "height"}
   style={styles.container}
  >
   <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.form}>
     <Text style={styles.title}>Create Account</Text>
     <Text style={styles.subtitle}>Sign up to get started</Text>

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
      placeholder="Username"
      value={username}
      onChangeText={setUsername}
      autoCapitalize="none"
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

     <TextInput
      style={styles.input}
      placeholder="Confirm Password"
      value={confirmPassword}
      onChangeText={setConfirmPassword}
      secureTextEntry
      editable={!isLoading}
     />

     <TouchableOpacity
      style={[styles.button, isLoading && styles.buttonDisabled]}
      onPress={handleRegister}
      disabled={isLoading}
     >
      <Text style={styles.buttonText}>
       {isLoading ? "Creating..." : "Register"}
      </Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={() => router.back()}>
      <Text style={styles.link}>Already have an account? Login</Text>
     </TouchableOpacity>
    </View>
   </ScrollView>
  </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#fff",
 },
 scrollContent: {
  flexGrow: 1,
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
