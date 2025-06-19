import { View, Text , StyleSheet, Alert} from 'react-native';
import FriendForm from '../components/forms/FriendForm';
import { UserContext } from '../Context/UserProvider';
import AmigosService from '../models/AmigosService';
import { useContext, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/navi/HeaderBar';
const amigoService = new AmigosService();

const handleAdicionar = async({userId, friendEmail}) =>{
    try {
        await amigoService.create({userId : userId , friendEmail : friendEmail})
        Alert.alert("Amigo adicionado com sucesso!");
    } catch (error) {
        console.log("Erro ao adicionar");
        Alert.alert(error.message || "Erro ao adicionar amigo");
    } 
}
const handleRemover = async({userId, friendEmail}) =>{
        try {
            await amigoService.delete({userId : userId , friendEmail : friendEmail})
            Alert.alert("Amigo removido com sucesso!");
        } catch (error) {
            Alert.alert(error.message || "Erro ao remover amigo");
        }
    }


export default function AddFriend(){
    const {userCredentials} = useContext(UserContext)
    const [id,setId] = useState("");
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <HeaderBar onBack={() => navigation.navigate("Menu")} title={"Adicionar Amigo"}></HeaderBar>

            <FriendForm
             onChange={(text) => setId(text)} 
             valueId={id} 
             onSubmitAdd={()=>handleAdicionar({ userId: userCredentials.uid, friendEmail: id })}
             onSubmitRemove={() => handleRemover({ userId: userCredentials.uid,friendEmail: id })}
             ></FriendForm>
        </View>
    )
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 16,
    paddingTop: 25,
    backgroundColor: '#072330',
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    marginTop: -4,
    marginLeft: 4,
  },
});