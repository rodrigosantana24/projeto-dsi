import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { UserContext } from '../Context/UserProvider';
import useFriends from '../hooks/useFriends';
import { TouchableOpacity, Image } from 'react-native';
import HeaderBar from '../components/navi/HeaderBar';
import { useNavigation } from '@react-navigation/native';
import AddFriend from './AddFriend';
import SearchBar from '../components/search/SearchBar';
import getFriendsFilter from '../services/getFriendsFilter';
import AddButton from '../components/buttons/AddButton';
import SearchGeneric from '../components/search/SearchGeneric';
import AmigosService from '../services/AmigosService';
import getNickName from '../services/getNickName';
import FriendNickName from '../components/FriendNickName';
import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';

const amigoService = new AmigosService();


export default function FriendList() {
  const { userCredentials } = useContext(UserContext);
  const { usuario, amigos, loading } = useFriends(userCredentials.uid);
  const [searchText, setSearchText] = useState("");
  const friendsArray = Array.isArray(amigos) ? amigos : [];
  const filteredFriends = getFriendsFilter(friendsArray, searchText);  
  const navigation = useNavigation();

  const handleRemover = async({userId, friendEmail}) =>{
        try {
          await amigoService.delete({userId : userId , friendEmail : friendEmail})
          Toast.show({
            type: 'success',
            text1: 'Amigo removido com sucesso!'
          });
          navigation.replace('FriendList')
        } catch (error) {
            Toast.show({
              type: 'error',  
              text1: error.message || "Erro ao remover amigo"
            });
        }
  };
  const handleUpdate = async({userId, friendEmail, nickName}) => {
    try {
        await amigoService.update({userId : userId , nickName: nickName , friendEmail : friendEmail})
        Toast.show({
          type: 'success',  
          text1: 'Amigo atualizado com sucesso!'
        });
    } catch (error) {
        console.log("Erro ao atualizar");
        Toast.show({
          type: 'error',
          text1: error.message || "Erro ao atualizar amigo"
        });
    }
  };

  if (loading) {
    return (
         <View style={[styles.container, styles.loadingContainer]}>
           <ActivityIndicator size="large" color="#FFFFFF" />
         </View>
       );
  }

 return (

  <View style={styles.container}>

    <HeaderBar onBack={() => navigation.goBack()} title={"Lista de amigos"}></HeaderBar>
    <SearchGeneric
      value={searchText}
      placeholder="Pesquisar ..."
      onSearch={setSearchText}
    />

    <ScrollView>
        {filteredFriends.length === 0 ? (
          <Text style={styles.noData}>Você ainda não tem amigos adicionados.</Text>
        ) : (
          filteredFriends.map((amigo) => (
            <View key={amigo.uid} style={styles.friendBlock}>
              <View style={styles.friendHeader}>
                <Text style={styles.friendName}>{amigo.name}</Text>
                <TouchableOpacity
                  onPress={() => handleRemover({ userId: userCredentials.uid, friendEmail: amigo.email })}
                  style={styles.removeButton}
                >
                  <MaterialIcons name="delete" size={28} color="#f4a03f" />
                </TouchableOpacity>
              </View>
              <Text style={styles.friendEmail}>{amigo.email}</Text>

              <FriendNickName
                userId={userCredentials.uid}
                amigoId={amigo.uid}
                style={styles.nickName}
              />

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
    <AddButton onPress={() => navigation.navigate('AddFriend')}></AddButton>
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 25,
    backgroundColor: '#072330',
  },
  friendBlock: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#113342',
    borderRadius: 8,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"#FFF",
    marginBottom: 5,
  },
  friendEmail: {
    fontSize: 14,
    color: '#f4a03f',
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
  nickName: {
    color: '#f4a03f',
    fontSize: 14,
    marginBottom: 15,
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
  friendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    padding: 5,
  },
});

const searchStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 14,
  },
});