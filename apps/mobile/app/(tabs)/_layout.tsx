/**
 * Tabs Layout
 * Main navigation with bottom tabs
 */

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
 return (
  <Tabs
   screenOptions={{
    tabBarActiveTintColor: "#007AFF",
    tabBarInactiveTintColor: "#8E8E93",
    headerShown: true,
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
