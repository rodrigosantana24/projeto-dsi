import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity} from 'react-native';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Logo } from '../components/logo/Logo';
import ProfileButton from '../components/buttons/ProfileButton';
import BottomTab from '../components/navi/BottomTab'
import { useNavigation } from '@react-navigation/native';
import FavoriteMovieScreen from './FavoriteMovieScreen';
import AddMovieScreen from '../screens/AddMovieScreen';
import GenresListScreen from './GenresListScreen';
import ActorsListScreen from './ActorsListScreen';
import { UserContext } from '../Context/UserProvider';
import FriendList from './FriendList';
import { signOut } from 'firebase/auth';
import { auth, database } from '../configs/firebaseConfig';
import { ref, get } from 'firebase/database';


const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userCredentials, setUserCredentials } = useContext(UserContext);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (userCredentials?.uid) {
        const nameRef = ref(database, `usuarios/${userCredentials.uid}/name`);
        const snapshot = await get(nameRef);
        
        if (snapshot.exists()) {
          setUserName(snapshot.val());
        } else {
          setUserName(userCredentials.email);
        }
      }
    };

    fetchUserName();
  }, [userCredentials]); 


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

  return ( 
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.username}>{userName}</Text>
            <Text style={styles.email}>{userCredentials.email}</Text>
          </View>
          <Logo style={{ width: 100, height: 100 }} />
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
  logo: {
    width: 220,
    height: 220,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    marginBottom: 60,
  },
  userInfoContainer: {
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  username: {
    color: 'white',
    fontSize: 28, 
    fontWeight: 'bold',
  },
  email: {
    color: '#ccc', 
    fontSize: 18, 
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