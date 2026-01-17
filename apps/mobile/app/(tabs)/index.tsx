/**
 * Resumes Tab Screen
 * Uses NativeWind for styling and useResume hook
 */

import {
 View,
 Text,
 FlatList,
 TouchableOpacity,
 ActivityIndicator,
} from "react-native";
import { useResume } from "@profile/features";
import { useResumeStore } from "../../providers/StoresProvider";

export default function ResumesScreen() {
 const resumeStore = useResumeStore();

 const { resumes, isLoading } = useResume({
  store: resumeStore,
  autoFetch: true,
 });

 if (isLoading && resumes.length === 0) {
  return (
   <View className="flex-1 justify-center items-center bg-secondary-50">
    <ActivityIndicator size="large" color="#0ea5e9" />
   </View>
  );
 }

 return (
  <View className="flex-1 bg-secondary-50">
   <FlatList
    data={resumes}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
     <TouchableOpacity className="bg-white p-4 mx-4 my-2 rounded-xl shadow-sm">
      <Text className="text-lg font-semibold mb-1 text-secondary-900">
       {item.title}
      </Text>
      <Text className="text-sm text-secondary-500">
       Updated: {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
     </TouchableOpacity>
    )}
    ListEmptyComponent={
     <View className="flex-1 justify-center items-center pt-24">
      <Text className="text-lg font-semibold text-secondary-500">
       No resumes yet
      </Text>
      <Text className="text-sm text-secondary-400 mt-2">
       Create your first resume to get started
      </Text>
     </View>
    }
   />
  </View>
 );
}
