/**
 * Profile Tab Screen
 */

import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../providers/StoresProvider";
import { tokenManager } from "../../providers/ApiProvider";

export default function ProfileScreen() {
 const router = useRouter();
 const user = useAuthStore((state) => state.user);
 const logout = useAuthStore((state) => state.logout);

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
  <View style={styles.container}>
   <View style={styles.header}>
    <View style={styles.avatar}>
     <Text style={styles.avatarText}>
      {user?.name?.charAt(0)?.toUpperCase() ??
       user?.username?.charAt(0)?.toUpperCase() ??
       "U"}
     </Text>
    </View>
    <Text style={styles.name}>{user?.name ?? user?.username ?? "User"}</Text>
    <Text style={styles.email}>{user?.email ?? "user@example.com"}</Text>
   </View>

   <View style={styles.actions}>
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
     <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
   </View>
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#F2F2F7",
 },
 header: {
  backgroundColor: "#fff",
  paddingTop: 40,
  paddingBottom: 30,
  alignItems: "center",
  borderBottomWidth: 1,
  borderBottomColor: "#E5E5EA",
 },
 avatar: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: "#007AFF",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
 },
 avatarText: {
  color: "#fff",
  fontSize: 32,
  fontWeight: "600",
 },
 name: {
  fontSize: 24,
  fontWeight: "600",
  marginBottom: 4,
 },
 email: {
  fontSize: 16,
  color: "#666",
 },
 actions: {
  marginTop: 20,
  paddingHorizontal: 16,
 },
 button: {
  backgroundColor: "#FF3B30",
  borderRadius: 12,
  padding: 16,
  alignItems: "center",
 },
 buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
 },
});
