import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import ProfileButton from '../components/buttons/ProfileButton';
import BottomTab from '../components/navi/BottomTab'
import { useNavigation, useRoute } from '@react-navigation/native';
import FavoriteMovieScreen from './FavoriteMovieScreen';
import AddMovieScreen from '../screens/AddMovieScreen';
import ManageGenresScreen from '../screens/ManageGenresScreen';
import { UserContext } from '../Context/UserProvider';
import FriendList from './FriendList';
import AddFriend from '../screens/AddFriend';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const {userCredentials} = useContext(UserContext)
  return ( 
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.username}>{userCredentials.email}</Text>
            <FontAwesome name="user-circle-o" size={50} color="white"/>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <ProfileButton 
              icon= {<Ionicons name="heart" size={30} color={"white"}/>} 
              text="Favoritos" 
              onPress={() => {
                navigation.navigate(FavoriteMovieScreen);
              }}
            />
            <ProfileButton 
              icon= {<Ionicons name="earth-sharp" size={30} color={"white"}/>} 
              text="Amigos" 
              onPress={() => {
                navigation.navigate(FriendList);
              }}
            />
            <ProfileButton 
              icon= {<Ionicons name="person-add" size={30} color={"white"}/>} 
              text="Adicionar Amigo" 
              onPress={() => {
                navigation.navigate(AddFriend);
              }}
            />
            <ProfileButton 
              icon= {<Ionicons name="list" size={30} color={"white"}/>} 
              text="Minhas Listas" 
              onPress={() => {
                alert("Minhas Listas");
              }}
            />
            <ProfileButton 
              icon={<Ionicons name="add" size={30} color={"white"}/>} 
              text="Adicionar filme" 
              onPress={() => {
                navigation.navigate(AddMovieScreen);
              }}
            />
            <ProfileButton 
              icon={<AntDesign name="setting" size={30} color={"white"}/>} 
              text="Gerenciar gêneros" 
              onPress={() => {
                navigation.navigate(ManageGenresScreen);
              }}
            />
            <ProfileButton 
              icon={<MaterialIcons name="power-settings-new" size={30} color="white"/>} 
              text="Sair" showArrow={false} 
              />
            </View>
        </ScrollView>
        <View style={styles.footer}>
              <BottomTab/>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#072330',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  content: {
    flexGrow: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-end',
    gap: 50,
    marginRight: 10,
    marginBottom: 60,
  },
  username: {
    marginTop: 10,
    color: 'white',
    fontSize: 29,
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: '#192936',
    borderRadius: 10,
    paddingVertical: 10,
  },
});

export default ProfileScreen;