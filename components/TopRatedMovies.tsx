import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
const { item } = useLocalSearchParams();
const parsedItem = item ? JSON.parse(item) : null;
const TopRatedMovies = () => {
  return (
    <View className=" flex-1">
      <Text>TopRatedMovies</Text>
    </View>
  );
};

export default TopRatedMovies;
