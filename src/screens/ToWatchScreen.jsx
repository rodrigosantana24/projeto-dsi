import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from "react-native";
import ListCard from "../components/cards/ListsCard";

const moviesToWatch = [
  { 
    id: '1',
    title: 'Tropa de Elite 2',
    image: require('../assets/cards/teste6.webp'),
    themeSession: 'Assistir mais tarde',
  },
  { 
    id: '2',
    title: 'Velozes e Furiosos 10',
    image: require('../assets/cards/velozes_furiosos.jpg'),
    themeSession: 'Assistir mais tarde',
  },
  { 
    id: '3',
    title: 'Harry Potter',
    image: require('../assets/cards/teste11.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    id: '4',
    title: 'Pantera Negra',
    image: require('../assets/cards/teste12.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    id: '5',
    title: 'The Beast Within',
    image: require('../assets/cards/teste8.webp'),
    themeSession: 'Mais Assistidos',
  }
];

export default function ToWatch() {
  const renderMovieItem = ({ item }) => (
    <ListCard
      title={item.title}
      image={item.image}
      onPress={() => console.log("Card:", item.title)} 
      style={styles.movieCardStyle} 
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Assistir mais tarde</Text>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filtro ▼</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={moviesToWatch}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id} 
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContentContainer} 
        columnWrapperStyle={styles.columnWrapperStyle}
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
    paddingTop: 50,
  },
  headerSection: {
    paddingHorizontal: 15, 
    marginBottom: 10,
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
    marginBottom: 20,       
  },
  filterButton: {
    alignSelf: "flex-start",
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
 flatListContentContainer: {
    paddingHorizontal: 10, 
    paddingBottom: 20, 
  },
  columnWrapperStyle: {
    justifyContent: 'space-between', 
  },
  movieCardStyle: {
    marginHorizontal: 5, 
    marginBottom: 15,
  },  
  addButton: {
    backgroundColor: "#f4a03f", 
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 35,
    width: "90%", 
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});