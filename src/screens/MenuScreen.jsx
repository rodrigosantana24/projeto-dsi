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
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192936',
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
    marginBottom: 30,
  },
  username: {
    marginTop: 10,
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: '#192936',
    borderRadius: 10,
    paddingVertical: 10,
  },
});

export default ProfileScreen;