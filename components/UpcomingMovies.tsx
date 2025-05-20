import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type MovieItem = {
  Poster: string;
  Title: string;
  [key: string]: any;
};

type MovieProp = {
  title: string;
  data: MovieItem[];
  route: string;
  isActorRoute: boolean;
  actorData: {};
};

const { height, width } = Dimensions.get("window");

const UpcomingMovies = ({
  title,
  data,
  route,
  isActorRoute,
  actorData,
}: MovieProp) => {
  const router = useRouter();

  return (
    <View className="mb-8 space-y-4">
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl mb-4">{title}</Text>
        <TouchableOpacity
          onPress={() =>
            isActorRoute
              ? router.push({
                  pathname: route,
                  params: { actorData: JSON.stringify(actorData) },
                })
              : router.push(route)
          }
        >
          <Text style={styles.text} className="text-xl mb-3">
            All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {data.slice(0, 5).map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() =>
                router.push({
                  pathname: "/Movie",
                  params: {
                    item: JSON.stringify(item),
                  },
                })
              }
            >
              <View className="space-y-1 mr-4">
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  style={{
                    width: width * 0.33,
                    height: height * 0.22,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                />
                <Text
                  className="text-white text-sm text-center"
                  numberOfLines={1}
                >
                  {item.Title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default UpcomingMovies;

const styles = StyleSheet.create({
  text: { color: "white" },
});
