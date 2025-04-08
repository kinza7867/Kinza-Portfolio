import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import axios from "axios";

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/movies")
      .then(response => setMovies(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Disney Movies ✨</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.movieTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 40,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  movieCard: {
    backgroundColor: "#23254a",
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 220,
    borderRadius: 5,
  },
  movieTitle: {
    fontSize: 18,
    marginTop: 10,
    color: "#fff",
  },
});
