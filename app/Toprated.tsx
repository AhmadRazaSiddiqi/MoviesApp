import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
type item = {
  id: number;
  name: string;
  title: string;
  poster_path: string;
};
export default function Toprated() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${API_KEY}`
      )
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error(err));
  }, []);
  type item = {
    id: number;
    title: string;
    name: string;
    poster_path: string;
  };
  const router = useRouter();
  return (
    <View className="flex-1 bg-neutral-800 p-4">
      <Text className="text-white text-3xl font-bold mb-4">
        Top Rated Movies
      </Text>
      <FlatList
        data={movies}
        numColumns={2}
        keyExtractor={(item: item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            className="w-[50%] mb-4 mr-3"
            onPress={() =>
              router.push({
                pathname: "/Movie",
                params: {
                  item: JSON.stringify(item),
                },
              })
            }
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}
              className="w-full h-72 rounded-xl"
              resizeMode="contain"
            />
            <Text className="text-white mt-2 text-lg text-center">
              {item.title || item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
