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
const api_key = process.env.EXPO_PUBLIC_API_KEY;

const Actors = () => {
  const [castData, setCastData] = useState([]);
  const [ActorDetails, setActorDetails] = useState<any>({});
  const [liked, setliked] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

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
          `https://api.themoviedb.org/3/person/${parsedItem?.id}/movie_credits?api_key=${api_key}`
        );

        if (creditsRes.data) {
          setCastData(creditsRes.data.cast);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }

      try {
        const ActorRes = await axios.get(
          `https://api.themoviedb.org/3/person/${parsedItem?.id}?api_key=${api_key}`
        );

        if (ActorRes.data) {
          setActorDetails(ActorRes.data);
        }
      } catch (error) {
        console.error("Error fetching actor details:", error);
      }
    })();
  }, [parsedItem?.id]);

  // Biography truncation logic
  const bio = ActorDetails?.biography || "";
  const bioWords = bio.split(" ");
  const isLongBio = bioWords.length > 50;
  const displayedBio = showFullBio
    ? bio
    : bioWords.slice(0, 50).join(" ") + (isLongBio ? "..." : "");

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

          {/* Biography with Read More */}
          <Text
            style={{
              color: "#bbbbbb",
              lineHeight: 22,
              marginBottom: isLongBio ? 8 : 24,
            }}
          >
            {displayedBio}
          </Text>

          {isLongBio && (
            <TouchableOpacity onPress={() => setShowFullBio(!showFullBio)}>
              <Text style={{ color: "#00baff", marginBottom: 24 }}>
                {showFullBio ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Cast Section */}
          <UpcomingMovies
            title={"Top Rated Movies"}
            data={castData}
            actorData={ActorDetails}
            route={"/ActorMovies"}
            isActorRoute={true}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Actors;
