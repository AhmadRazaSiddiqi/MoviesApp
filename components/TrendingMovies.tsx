import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

type Props = {
  data: Movie[];
};

const { width, height } = Dimensions.get("window");
export default function TrendingMovies({ data }: Props) {
  return (
    <View className="mb-8">
      <Text className="text-white text-2xl mx-4 my-4 mb-5">
        Trending Movies
      </Text>
      <Carousel
        loop
        width={width * 0.7}
        height={height * 0.5}
        autoPlay={false}
        data={data}
        scrollAnimationDuration={500}
        renderItem={({ item }) => <MovieCard item={item} />}
        style={{ alignSelf: "center" }}
        mode="parallax"
      />
    </View>
  );
}

type MovieCardProps = {
  item: Movie;
};

const MovieCard = ({ item }: MovieCardProps) => {
  const router = useRouter();
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        router.push({
          pathname: "/Movie",
          params: {
            item: JSON.stringify(item),
          },
        })
      }
    >
      <View className="items-center">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          }}
          style={{
            width: width * 0.6,
            height: height * 0.5,
            borderRadius: 24,
          }}
          resizeMode="cover"
        />
        <Text
          className="text-white text-center mt-2  font-bold"
          style={{ fontSize: 18 }}
        >
          {item.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
