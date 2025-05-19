import SearchComp from "@/components/SearchComp";
import TrendingMovies from "@/components/TrendingMovies";
import UpcomingMovies from "@/components/UpcomingMovies";

import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const android = Platform.OS === "android";
const API_KEY = "ae7bfaed01f966e789c46101e46cbb25"; // ✅ Centralize your API key

export default () => {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [showSearch, setShowSearch] = useState(false); // 🔹 Search visibility toggle

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${API_KEY}`
        );
        if (response.data.results) {
          setTrending(response.data.results);
        }
      } catch (error) {
        console.error("Error fetching trending:", error);
      }
    };

    const fetchUpcoming = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&api_key=${API_KEY}`
        );
        if (response.data.results) {
          setUpcoming(response.data.results);
        }
      } catch (error) {
        console.error("Error fetching upcoming:", error);
      }
    };

    const fetchTopRated = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${API_KEY}`
        );
        if (response.data.results) {
          setTopRated(response.data.results);
        }
      } catch (error) {
        console.error("Error fetching top rated:", error);
      }
    };

    fetchTrending();
    fetchUpcoming();
    fetchTopRated();
  }, []);

  return (
    <View className="flex-1 bg-neutral-800 pt-4">
      <StatusBar hidden />
      <SafeAreaView className={android ? "mb-2" : "mb-3"}>
        <View className="flex-row justify-between items-center mx-4 mb-2">
          <Entypo name="menu" size={30} color="white" />
          <Text className="text-white text-4xl font-bold">Movies</Text>
          <TouchableOpacity onPress={() => setShowSearch((prev) => !prev)}>
            <Entypo name="magnifying-glass" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 🔍 Conditionally show search dropdown */}
      {showSearch && (
        <SearchComp apiKey={API_KEY} onClose={() => setShowSearch(false)} />
      )}

      {/* 🎬 Movie content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <TrendingMovies data={trending} />
        <UpcomingMovies title="Upcoming Movies" data={upcoming} />
        <UpcomingMovies title="Top Rated Movies" data={topRated} />
      </ScrollView>
    </View>
  );
};
