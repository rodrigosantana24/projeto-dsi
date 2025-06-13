import React, { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { UserContext } from '../Context/UserProvider';
import useFriends from '../hooks/useFriends';

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
      <Text style={styles.title}></Text>

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
              amigo.favoritos.map((filme) => (
                <View key={filme.id} style={styles.filmeItem}>
                  <Text style={styles.filmeTitle}>{filme.title}</Text>
                  <Text style={styles.filmeAno}>Média de votos: {filme.vote_average}</Text>
                </View>
              ))
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192936',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
   username: {
    marginTop: 10,
    color: 'white',
    fontSize: 29,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    marginVertical: 8
  },
  friendBlock: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  friendEmail: {
    fontSize: 14,
    color: '#555'
  },
  subtitle: {
    marginTop: 8,
    fontWeight: 'bold'
  },
  filmeItem: {
    backgroundColor: '#e0f7fa',
    padding: 8,
    borderRadius: 6,
    marginTop: 4
  },
  filmeTitle: {
    fontSize: 15,
  },
  filmeAno: {
    fontSize: 13,
    color: '#777'
  },
  noData: {
    fontStyle: 'italic',
    color: '#999'
  }
});
