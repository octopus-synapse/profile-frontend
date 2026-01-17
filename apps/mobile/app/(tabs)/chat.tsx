/**
 * Chat Tab Screen
 * Uses NativeWind for styling and useChat hook
 */

import {
 View,
 Text,
 FlatList,
 TouchableOpacity,
 ActivityIndicator,
} from "react-native";
import { useChat } from "@profile/features";
import { useChatStore } from "../../providers/StoresProvider";

export default function ChatScreen() {
 const chatStore = useChatStore();

 const { conversations, isLoading } = useChat({
  store: chatStore,
  autoFetchConversations: true,
 });

 if (isLoading && conversations.length === 0) {
  return (
   <View className="flex-1 justify-center items-center bg-secondary-50">
    <ActivityIndicator size="large" color="#0ea5e9" />
   </View>
  );
 }

 return (
  <View className="flex-1 bg-secondary-50">
   <FlatList
    data={conversations}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
     <TouchableOpacity className="bg-white p-4 mx-4 my-2 rounded-xl shadow-sm flex-row items-center">
      <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
       <Text className="text-primary-600 font-semibold text-lg">
        {item.title?.[0] || "C"}
       </Text>
      </View>
      <View className="flex-1">
       <Text className="text-base font-semibold text-secondary-900">
        {item.title || "Conversation"}
       </Text>
       <Text className="text-sm text-secondary-500" numberOfLines={1}>
        {item.lastMessage || "No messages yet"}
       </Text>
      </View>
     </TouchableOpacity>
    )}
    ListEmptyComponent={
     <View className="flex-1 justify-center items-center pt-24">
      <Text className="text-lg font-semibold text-secondary-500">
       No conversations yet
      </Text>
      <Text className="text-sm text-secondary-400 mt-2">
       Start a new chat to get started
      </Text>
     </View>
    }
   />
  </View>
 );
}
