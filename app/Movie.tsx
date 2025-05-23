import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Define interfaces for type safety
interface ParsedItem {
  id: number;
  original_title: string;
  name: string;
  release_date?: string;
  poster_path?: string;
  overview?: string;
  Genre?: string;
  Runtime?: string;
  [key: string]: any;
}

const { width, height } = Dimensions.get("window");

const Movies = () => {
  const [castData, setCastData] = useState([]);
  const [crewData, setCrewData] = useState([]);
  const [genreList, setgenreList] = useState([]);
  const [liked, setliked] = useState(false);
  const { item } = useLocalSearchParams<{ item?: string }>();
  const parsedItem: ParsedItem | null = item ? JSON.parse(item) : null;
  type crewProps = {
    job: string;
    department: string;
    name: string;
  };
  useEffect(() => {
    (async () => {
      if (!parsedItem?.id) return;

      try {
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${parsedItem.id}/credits?api_key=${process.env.EXPO_PUBLIC_API_KEY}`
        );
        const GenreList = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.EXPO_PUBLIC_API_KEY}`
        );

        if (creditsRes.data) {
          setCastData(creditsRes.data.cast);
          setCrewData(creditsRes.data.crew);
          setgenreList(GenreList.data.genres);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    })();
  }, [parsedItem?.id]);
  const director = crewData.find(
    (member: crewProps) => member.job === "Director"
  );
  const writers = crewData.filter(
    (member: crewProps) =>
      member.job === "Writer" || member.department === "Writing"
  );

  const genres = parsedItem?.genre_ids || [];

  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ width, height: height * 0.6, position: "relative" }}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${parsedItem?.poster_path}`,
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(18,18,18,0.8)", "rgba(18,18,18,1)"]}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: height * 0.3,
              zIndex: 1,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 16,
              paddingTop: 40,
              zIndex: 2,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setliked(!liked);
              }}
            >
              {liked ? (
                <Ionicons name="heart" size={30} color="red" />
              ) : (
                <Ionicons name="heart-outline" size={30} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: -60, paddingHorizontal: 16, zIndex: 2 }}>
          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            {parsedItem?.original_title || "Movie Title"}
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <Text style={{ color: "#bbbbbb", marginRight: 12 }}>
              Released • {parsedItem?.release_date || "N/A"}
            </Text>
            <Text style={{ color: "#FFD700", fontWeight: "bold" }}>
              {parsedItem?.vote_average.toFixed(1) || "N/A"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            {genres.length > 0 ? (
              genres.map((genre, index) => {
                const match = genreList.find((el) => el.id === genre);
                return (
                  <Text
                    key={index}
                    style={{
                      color: "#bbbbbb",
                      marginRight: 10,
                    }}
                  >
                    {match?.name}
                    {index < genres.length - 1 ? " •" : ""}
                  </Text>
                );
              })
            ) : (
              <Text style={{ color: "#bbbbbb" }}>No genre information</Text>
            )}
          </View>

          <Text
            style={{
              color: "#bbbbbb",
              lineHeight: 22,
              marginBottom: 24,
            }}
          >
            {parsedItem?.overview || "No plot description available."}
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 16,
            }}
          >
            Top Cast
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              justifyContent:
                castData.length > 3 ? "space-between" : "flex-start",
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {castData.length > 0 ? (
              castData.slice(0, 6).map((actor: any, index: number) => (
                <View
                  key={index}
                  style={{
                    alignItems: "center",
                    width: width / 4 - 16,
                    marginRight: castData.length <= 3 ? 16 : 0,
                    marginBottom: 16,
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() =>
                      router.push({
                        pathname: "/Actors",
                        params: {
                          actorData: JSON.stringify(actor),
                        },
                      })
                    }
                  >
                    <Image
                      source={{
                        uri: actor?.profile_path
                          ? `https://image.tmdb.org/t/p/w500${actor?.profile_path}`
                          : "https://via.placeholder.com/70",
                      }}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        marginBottom: 8,
                      }}
                    />
                  </TouchableWithoutFeedback>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                    numberOfLines={1}
                  >
                    {actor.name}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#bbbbbb" }}>
                No cast information available
              </Text>
            )}
          </ScrollView>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              Director
            </Text>
            <Text style={{ color: "#bbbbbb" }}>
              {director?.name || "No director information available"}
            </Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              Writers
            </Text>
            <Text style={{ color: "#bbbbbb" }}>
              {writers.length > 0
                ? writers.map((w) => w.name).join(", ")
                : "No writer information available"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Movies;
