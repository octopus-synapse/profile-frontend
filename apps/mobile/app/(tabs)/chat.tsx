/**
 * Chat Tab Screen
 */

import { View, Text, StyleSheet } from "react-native";

export default function ChatScreen() {
 return (
  <View style={styles.container}>
   <Text style={styles.text}>Chat</Text>
   <Text style={styles.subtext}>Coming soon...</Text>
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F2F2F7",
 },
 text: {
  fontSize: 24,
  fontWeight: "600",
 },
 subtext: {
  fontSize: 16,
  color: "#666",
  marginTop: 8,
 },
});
