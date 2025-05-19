import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";

type Props = {
  apiKey: string;
  onClose?: () => void;
};

export default function SearchComp({ apiKey, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length > 2) {
        searchMovies(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchMovies = async (query: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}`
      );
      const formatted = res.data.results.map((movie: any) => ({
        id: movie.id,
        name: movie.title || "N/A",
        fullData: movie,
      }));
      setSearchResults(formatted);
    } catch (err) {
      console.error("Error searching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
      <SearchableDropdown
        onTextChange={(text: any) => setSearchQuery(text)}
        onItemSelect={(item: any) => {
          router.push({
            pathname: "/Movie",
            params: {
              item: JSON.stringify(item.fullData),
            },
          });
          setSearchQuery("");
          onClose?.();
        }}
        items={searchResults}
        defaultIndex={-1}
        resetValue={false}
        placeholder="Search for a movie..."
        textInputProps={{
          placeholderTextColor: "#ccc",
          underlineColorAndroid: "transparent",
          style: {
            color: searchQuery === "" ? "#ccc" : "#fff", // match placeholder when empty
            padding: 12,
            backgroundColor: "#121212",
            borderRadius: 8,
          },
        }}
        itemsContainerStyle={{ maxHeight: 200 }}
        itemStyle={styles.itemStyle}
        itemTextStyle={styles.itemTextStyle}
      />
      {loading && <ActivityIndicator color="#fff" style={{ marginTop: 10 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#1f1f1f",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  itemTextStyle: {
    color: "#fff",
  },
});
