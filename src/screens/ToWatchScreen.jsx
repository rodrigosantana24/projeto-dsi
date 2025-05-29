import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from "react-native";
import MovieCard from "../components/cards/MovieCard";

const moviesToWatch = [
  { 
    title: 'Tropa de Elite 2',
    image: require('../assets/cards/teste6.webp'),
    themeSession: 'Assistir mais tarde',
  },

  { 
    title: 'Velozes e Furiosos 10',
    image: require('../assets/cards/velozes_furiosos.jpg'),
    themeSession: 'Assistir mais tarde',
  },
];

export default function ToWatch() {
  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCardItemContainer}
      onPress={() => console.log("Pressed:", item.title)} 
    >
      <MovieCard
        title={item.title}
        image={item.image}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Assistir mais tarde</Text>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filtro ▼</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={moviesToWatch}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id || item.title} 
        contentContainerStyle={styles.flatListContentContainer}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>ADICIONAR/REMOVER FILMES</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#192936", 
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc', 
    marginTop: 0,
    marginBottom: 20,       
  },
  filterButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#f4a03f",  
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterText: {
    color: "#f4a03f",
    fontSize: 16,
  },
 scrollContentContainer: {
    paddingHorizontal: 20, 
    paddingBottom: 20,
    alignItems: 'center', 
  },
  movieCardItemContainer: {
    marginBottom: 16, 
  },
  addButton: {
    backgroundColor: "#f4a03f", 
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});