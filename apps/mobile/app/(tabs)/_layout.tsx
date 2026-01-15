/**
 * Tabs Layout
 * Main navigation with bottom tabs
 * Uses primary color from NativeWind theme
 */

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
 return (
  <Tabs
   screenOptions={{
    tabBarActiveTintColor: "#0ea5e9", // primary-500
    tabBarInactiveTintColor: "#94a3b8", // secondary-400
    headerShown: true,
    headerStyle: {
     backgroundColor: "#ffffff",
    },
    headerTitleStyle: {
     fontWeight: "600",
     color: "#0f172a", // secondary-900
    },
    tabBarStyle: {
     backgroundColor: "#ffffff",
     borderTopColor: "#e2e8f0", // secondary-200
    },
   }}
  >
   <Tabs.Screen
    name="index"
    options={{
     title: "Resumes",
     tabBarIcon: ({ color, size }) => (
      <Ionicons name="document-text-outline" size={size} color={color} />
     ),
    }}
   />
   <Tabs.Screen
    name="social"
    options={{
     title: "Social",
     tabBarIcon: ({ color, size }) => (
      <Ionicons name="people-outline" size={size} color={color} />
     ),
    }}
   />
   <Tabs.Screen
    name="chat"
    options={{
     title: "Chat",
     tabBarIcon: ({ color, size }) => (
      <Ionicons name="chatbubbles-outline" size={size} color={color} />
     ),
    }}
   />
   <Tabs.Screen
    name="profile"
    options={{
     title: "Profile",
     tabBarIcon: ({ color, size }) => (
      <Ionicons name="person-outline" size={size} color={color} />
     ),
    }}
   />
  </Tabs>
 );
}
