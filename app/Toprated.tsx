import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
type item = {
  id: number;
  name: string;
  title: string;
  poster_path: string;
};
export default function Trending() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`)
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error(err));
  }, []);
  type item = {
    id: number;
    title: string;
    name: string;
    poster_path: string;
  };
  return (
    <View className="flex-1 bg-neutral-800 p-4">
      <Text className="text-white text-3xl font-bold mb-4">
        Top Rated Movies
      </Text>
      <FlatList
        data={movies}
        keyExtractor={(item: item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-4">
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}
              className="w-full h-72 rounded-xl"
              resizeMode="cover"
            />
            <Text className="text-white mt-2 text-lg">
              {item.title || item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
