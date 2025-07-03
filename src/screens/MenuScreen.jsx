import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import ProfileButton from '../components/buttons/ProfileButton';
import BottomTab from '../components/navi/BottomTab'
import { useNavigation, useRoute } from '@react-navigation/native';
import FavoriteMovieScreen from './FavoriteMovieScreen';
import AddMovieScreen from '../screens/AddMovieScreen';
import GenresListScreen from './GenresListScreen';
import ActorsListScreen from './ActorsListScreen';
import ToScheduleScreen from './ToScheduleScreen';
import { UserContext } from '../Context/UserProvider';
import FriendList from './FriendList';
import AddFriend from '../screens/AddFriend';
import FilteringMovieScreen from '../screens/FilteringMovieScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { setUserCredentials } = useContext(UserContext);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserCredentials(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (error) {
      Alert.alert('Erro ao sair', 'Não foi possível sair da conta.');
      console.error(error);
    }
  };

  const {userCredentials} = useContext(UserContext)
  return ( 
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.username}>{userCredentials.email}</Text>
            <FontAwesome name="user-circle-o" size={50} color="white"/>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
        >
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
              icon={<AntDesign name="videocamera" size={30} color={"white"}/>} 
              text="Gerenciar Filmes" 
              onPress={() => {
                navigation.navigate(AddMovieScreen);
              }}
            />
            <ProfileButton 
              icon={<AntDesign name="plus" size={30} color={"white"}/>} 
              text="Gerenciar Gêneros" 
              onPress={() => {
                navigation.navigate(GenresListScreen);
              }}
            />
            <ProfileButton 
              icon={<AntDesign name="user" size={30} color={"white"}/>} 
              text="Gerenciar Atores" 
              onPress={() => {
                navigation.navigate(ActorsListScreen);
              }}
            />
            <ProfileButton
              icon={<AntDesign name="calendar" size={30} color={'white'}/>}
              text="Agendar" showArrow={true} 
              onPress={() => {
                navigation.navigate('ToScheduleScreen')
              }}
            />
            <ProfileButton 
              icon={<MaterialIcons name="power-settings-new" size={30} color="white"/>} 
              text="Sair" 
              showArrow={false} 
              onPress={() => setShowLogoutModal(true)}
            />
            </View>
            
        </ScrollView>
        <View style={styles.footer}>
              <BottomTab/>
        </View>

        {showLogoutModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Deseja realmente sair?</Text>
              <Text style={styles.modalMessage}>Você será desconectado da sua conta.</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: '#f4a03f' }]} 
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, { backgroundColor: '#dc3545' }]} 
                  onPress={async () => {
                    try {
                      await signOut(auth);
                      setUserCredentials(null);
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                      });
                    } catch (error) {
                      Alert.alert('Erro ao sair', 'Não foi possível sair da conta.');
                      console.error(error);
                    }
                  }}
                >
                  <Text style={styles.modalButtonText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: '#192936',
    borderRadius: 10,
    paddingVertical: 10,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#192936',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});

export default ProfileScreen;