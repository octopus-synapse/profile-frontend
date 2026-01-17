/**
 * Social Tab Screen
 * Uses NativeWind for styling and useSocial hook
 */

import {
 View,
 Text,
 FlatList,
 TouchableOpacity,
 ActivityIndicator,
} from "react-native";
import { useSocial } from "@profile/features";
import { useSocialStore } from "../../providers/StoresProvider";

export default function SocialScreen() {
 const socialStore = useSocialStore();

 const { feed, isLoading } = useSocial({
  store: socialStore,
  autoFetchFeed: true,
 });

 if (isLoading && feed.length === 0) {
  return (
   <View className="flex-1 justify-center items-center bg-secondary-50">
    <ActivityIndicator size="large" color="#0ea5e9" />
   </View>
  );
 }

 return (
  <View className="flex-1 bg-secondary-50">
   <FlatList
    data={feed}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
     <TouchableOpacity className="bg-white p-4 mx-4 my-2 rounded-xl shadow-sm">
      <View className="flex-row items-center mb-2">
       <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
        <Text className="text-primary-600 font-semibold">
         {item.username?.[0]?.toUpperCase() || "U"}
        </Text>
       </View>
       <View>
        <Text className="font-semibold text-secondary-900">
         {item.username}
        </Text>
        <Text className="text-xs text-secondary-400">
         {new Date(item.createdAt).toLocaleDateString()}
        </Text>
       </View>
      </View>
      <Text className="text-secondary-700">
       <Text className="font-medium">{item.action}</Text> {item.targetTitle}
      </Text>
     </TouchableOpacity>
    )}
    ListEmptyComponent={
     <View className="flex-1 justify-center items-center pt-24">
      <Text className="text-lg font-semibold text-secondary-500">
       No activity yet
      </Text>
      <Text className="text-sm text-secondary-400 mt-2">
       Follow users to see their activity
      </Text>
     </View>
    }
   />
  </View>
 );
}
