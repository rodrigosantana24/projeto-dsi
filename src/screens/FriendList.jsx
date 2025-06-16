import React, { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { UserContext } from '../Context/UserProvider';
import useFriends from '../hooks/useFriends';
import { TouchableOpacity, Image } from 'react-native';
export default function FriendList() {
  const { userCredentials } = useContext(UserContext);
  const { usuario, amigos, loading } = useFriends(userCredentials.uid);

  if (loading) {
    return (
         <View style={[styles.container, styles.loadingContainer]}>
           <ActivityIndicator size="large" color="#FFFFFF" />
         </View>
       );
  }

 return (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.username}>Olá, {usuario?.name}</Text>
    <ScrollView>
      {amigos.length === 0 ? (
        <Text style={styles.noData}>Você ainda não tem amigos adicionados.</Text>
      ) : (
        amigos.map((amigo) => (
          <View key={amigo.uid} style={styles.friendBlock}>
            <Text style={styles.friendName}>{amigo.name}</Text>
            <Text style={styles.friendEmail}>{amigo.email}</Text>

            <Text style={styles.subtitle}>Filmes Favoritos:</Text>
            
            {amigo.favoritos.length === 0 ? (
              <Text style={styles.noData}>Nenhum favorito.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moviesContainer}>
                {amigo.favoritos.map((filme) => (
                  <View key={filme.id} style={styles.movieCard}>
                    <Text style={styles.title_movie}>{filme.title}</Text>
                    <Image
                      source={{ uri: filme.poster_path 
                          ? "https://image.tmdb.org/t/p/original"+filme.poster_path 
                          : "https://via.placeholder.com/150x225?text=No+Poster" }}
                        style={styles.movieImage}
                        resizeMode="cover"
                        onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)}
                    />
                    <Text style={styles.filmeAno}>⭐ {filme.vote_average}/10</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        ))
      )}
    </ScrollView>
  </ScrollView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192936',
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  username: {
    marginTop: 10,
    color: 'white',
    fontSize: 29,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendBlock: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#223344',
    borderRadius: 10,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  friendEmail: {
    fontSize: 14,
    color: '#aabbcc',
    marginBottom: 15,
  },
  subtitle: {
    marginTop: 8,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  title_movie: {
    marginTop: 8,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 10,
    marginBottom: 10,
    alignSelf:"center"
  },
  moviesContainer: {
    marginTop: 5,
  },
  movieCard: {
    marginRight: 15,
    width: 120,
  },
  filmeAno: {
    fontSize: 13,
    color: '#dddddd',
    textAlign: 'center',
    marginTop: 5,
  },
  noData: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
  movieItem: {
    width: 120,
    marginRight: 15,
    marginBottom: 20,
  },
  movieImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#334455', // Cor de fundo se a imagem não carregar
  },
  filmeTitle: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Opção 2
  movieCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: '#223344',
    borderRadius: 8,
    overflow: 'hidden',
  },
  movieInfo: {
    padding: 10,
  },
});