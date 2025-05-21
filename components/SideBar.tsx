import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
type sidebarProps = {
  onClose: () => void;
};
export default function SideBar({ onClose }: sidebarProps) {
  const router = useRouter();
  return (
    <View className="absolute left-0 top-0 bottom-0 w-64 bg-neutral-900 z-50 p-4">
      <Text className="text-white text-xl font-bold mb-4">Menu</Text>

      <TouchableOpacity
        onPress={() => {
          router.push("/");
          onClose();
        }}
      >
        <Text className="text-white mb-3 text-xl">Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/Trending");
          onClose();
        }}
      >
        <Text className="text-white mb-3 text-xl">Trending Movies</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/Upcoming");
          onClose();
        }}
      >
        <Text className="text-white mb-3 text-xl">Upcoming Movies</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/Toprated");
          onClose();
        }}
      >
        <Text className="text-white mb-3 text-xl">Top Rated Movies</Text>
      </TouchableOpacity>
    </View>
  );
}
