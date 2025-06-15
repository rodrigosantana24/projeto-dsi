import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { getAuth } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { database } from "../configs/firebaseConfig"; 
import ListCard from "../components/cards/ListsCard";
import Filme from "../models/Filme";

export default function FavoriteMovieScreen() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userFavoritesRef = ref(database, `usuarios/${user.uid}/favoritos`);
          const snapshot = await get(userFavoritesRef);

          if (snapshot.exists()) {
            const favoriteIds = snapshot.val(); 

            const moviePromises = favoriteIds.map(id => {
              const movieRef = ref(database, `filmes/${id}`);
              return get(movieRef);
            });

            const movieSnapshots = await Promise.all(moviePromises);
            
            const moviesData = movieSnapshots.map((snap, index) => {
              if (snap.exists()) {
                return Filme.fromFirebase(favoriteIds[index], snap.val());
              }
              return null;
            }).filter(movie => movie !== null); 

            setFavoriteMovies(moviesData);
          } else {
            setFavoriteMovies([]);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar filmes favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, []);

  const renderMovieItem = ({ item }) => (
    <ListCard
      title={item.title}
      image={{ uri: item.getImageUrl() }} 
      onPress={() => console.log("Card:", item.title)} 
      style={styles.movieCardStyle} 
    />
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#f4a03f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Filmes favoritos</Text>
        <View style={styles.divider} />
      </View>

      {favoriteMovies.length === 0 ? (
        <View style={styles.center}>
            <Text style={styles.emptyText}>Você ainda não adicionou filmes aos favoritos.</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()} 
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContentContainer} 
          columnWrapperStyle={styles.columnWrapperStyle}
        />
      )}

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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
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