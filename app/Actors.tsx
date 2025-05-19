import UpcomingMovies from "@/components/UpcomingMovies";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ParsedItem {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
  overview?: string;
  Genre?: string;
  Runtime?: string;
  [key: string]: any;
}

const { width, height } = Dimensions.get("window");

const Actors = () => {
  const [castData, setCastData] = useState([]);
  const [ActorDetails, setActorDetails] = useState([]);
  const { actorData } = useLocalSearchParams<{ actorData?: string }>();
  const parsedItem: ParsedItem | null = actorData
    ? JSON.parse(actorData)
    : null;
  const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      if (!parsedItem?.id) return;

      try {
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/person/${parsedItem?.id}/movie_credits?api_key=ae7bfaed01f966e789c46101e46cbb25`
        );

        if (creditsRes.data) {
          setCastData(creditsRes.data.cast);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
      try {
        const ActorRes = await axios.get(
          `https://api.themoviedb.org/3/person/${parsedItem?.id}?api_key=ae7bfaed01f966e789c46101e46cbb25`
        );

        if (ActorRes.data) {
          setActorDetails(ActorRes.data);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    })();
  }, [parsedItem?.id]);

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Poster Image with Gradient */}
        <View style={{ width, height: height * 0.6, position: "relative" }}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${parsedItem?.profile_path}`,
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

          {/* Top Navigation */}
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
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Movie Title and Info */}
        <View style={{ marginTop: -60, paddingHorizontal: 16, zIndex: 2 }}>
          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            {parsedItem?.name || "Actor Name"}
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <Text style={{ color: "#bbbbbb", marginRight: 12 }}>
              {ActorDetails?.place_of_birth || "N/A"}
            </Text>
          </View>

          {/* Genres */}
          {/* <View style={{ flexDirection: "row", marginBottom: 16 }}>
            {genres.length > 0 ? (
              genres.map((genre, index) => (
                <Text
                  key={index}
                  style={{
                    color: "#bbbbbb",
                    marginRight: 10,
                  }}
                >
                  {genre}
                  {index < genres.length - 1 ? " •" : ""}
                </Text>
              ))
            ) : (
              <Text style={{ color: "#bbbbbb" }}>No genre information</Text>
            )}
          </View> */}

          {/* Description/Plot */}
          <Text
            style={{
              color: "#bbbbbb",
              lineHeight: 22,
              marginBottom: 24,
            }}
          >
            {ActorDetails?.biography || "No Biography available."}
          </Text>

          {/* Cast Section */}

          <UpcomingMovies title={"Top Rated Movies"} data={castData} />
          {/* Director */}
          {/* <View style={{ marginBottom: 24 }}>
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
          </View> */}

          {/* Writers */}
          {/* <View style={{ marginBottom: 24 }}>
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
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Actors;
