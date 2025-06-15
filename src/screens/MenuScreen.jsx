<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import ProfileButton from '../components/buttons/ProfileButton';
import BottomTab from '../components/navi/BottomTab'
import { useNavigation, useRoute } from '@react-navigation/native';
import ToWatch from './ToWatchScreen';


const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return ( 
      <View style={styles.container}>
          <View style={styles.content}>
              <View style={styles.header}>
                  <Text style={styles.username}>Nome de usuário</Text>
                  <FontAwesome name="user-circle-o" size={80} color="white"/>
              </View>

          <ProfileButton 
            icon={<Ionicons name="eye-outline" size={24} color={"white"}/>} 
            text="Assistidos" 
          />
          
          <ProfileButton 
            icon= {<Ionicons name="time-outline" size={24} color={"white"}/>} 
            text="Assistir mais tarde" 
            onPress={() => {
              navigation.navigate(ToWatch);
            }}
          />
          
          <ProfileButton 
            icon={<Ionicons name="heart-outline" size={24} color={"white"}/>} 
            text="Favoritos"
          />
          
          <ProfileButton 
            icon={<Feather name="edit" size={24} color="white"/>} 
            text="Editar perfil" showArrow={false} 
          />
          
          <ProfileButton 
            icon={<MaterialIcons name="power-settings-new" size={24} color="white"/>} 
            text="Sair" showArrow={false} 
            />
          </View>

          <View style={styles.footer}>
              <BottomTab/>
          </View>
=======
=======
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import ProfileButton from '../components/buttons/ProfileButton';
import BottomTab from '../components/navi/BottomTab'
import { useNavigation, useRoute } from '@react-navigation/native';
import WatchLaterScreen from './WatchLaterScreen';
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
              icon= {<Ionicons name="time-outline" size={30} color={"white"}/>} 
              text="Assistir mais tarde" 
              onPress={() => {
                navigation.navigate(WatchLaterScreen);
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
                navigation.navigate(WatchLaterScreen);
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
<<<<<<< HEAD
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
=======
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
<<<<<<< HEAD
    backgroundColor: '#192936',
=======
    backgroundColor: '#072330',
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
=======
    backgroundColor: '#072330',
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
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
<<<<<<< HEAD
<<<<<<< HEAD
    marginBottom: 30,
=======
    marginBottom: 100,
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
=======
    marginBottom: 100,
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
  },
  username: {
    marginTop: 10,
    color: 'white',
<<<<<<< HEAD
<<<<<<< HEAD
    fontSize: 25,
=======
    fontSize: 29,
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
=======
    fontSize: 29,
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: '#192936',
    borderRadius: 10,
    paddingVertical: 10,
  },
});

export default ProfileScreen;