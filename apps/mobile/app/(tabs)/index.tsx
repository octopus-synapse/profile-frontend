/**
 * Resumes Tab Screen
 */

import { useEffect } from "react";
import {
 View,
 Text,
 FlatList,
 TouchableOpacity,
 StyleSheet,
 ActivityIndicator,
} from "react-native";
import { useResumeStore } from "../../providers/StoresProvider";

export default function ResumesScreen() {
 const resumes = useResumeStore((state) => state.resumes);
 const isLoading = useResumeStore((state) => state.isLoading);
 const fetchResumes = useResumeStore((state) => state.fetchResumes);

 useEffect(() => {
  fetchResumes();
 }, []);

 if (isLoading && resumes.length === 0) {
  return (
   <View style={styles.centered}>
    <ActivityIndicator size="large" color="#007AFF" />
   </View>
  );
 }

 return (
  <View style={styles.container}>
   <FlatList
    data={resumes}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
     <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>
       Updated: {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
     </TouchableOpacity>
    )}
    ListEmptyComponent={
     <View style={styles.empty}>
      <Text style={styles.emptyText}>No resumes yet</Text>
      <Text style={styles.emptySubtext}>
       Create your first resume to get started
      </Text>
     </View>
    }
   />
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#F2F2F7",
 },
 centered: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
 },
 card: {
  backgroundColor: "#fff",
  padding: 16,
  marginHorizontal: 16,
  marginVertical: 8,
  borderRadius: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
 },
 cardTitle: {
  fontSize: 18,
  fontWeight: "600",
  marginBottom: 4,
 },
 cardSubtitle: {
  fontSize: 14,
  color: "#666",
 },
 empty: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingTop: 100,
 },
 emptyText: {
  fontSize: 18,
  fontWeight: "600",
  color: "#666",
 },
 emptySubtext: {
  fontSize: 14,
  color: "#999",
  marginTop: 8,
 },
});
