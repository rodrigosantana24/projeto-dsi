import { View, Text , StyleSheet} from 'react-native';
import FriendForm from '../components/forms/FriendForm';
import { UserContext } from '../Context/UserProvider';
import AmigosService from '../models/AmigosService';
import { useContext, useState} from 'react';

const amigoService = new AmigosService();

const handleAdicionar = async({UserId,FriendId}) =>{
    try {
        amigoService.create({userId : UserId , friendId : FriendId})
        console.log("TUDO OK create");
        
    } catch (error) {
        console.log("Erro ao adicionar");
        
    } 
}
const handleRemover = async({UserId,FriendId}) =>{
        try {
            amigoService.delete({userId : UserId , friendId : FriendId})
            console.log("removido");
            
        } catch (error) {
            console.log("ERRO AO REMOVER");
        } 
    }


export default function AddFriend(){
    const {userCredentials} = useContext(UserContext)
    const [id,setId] = useState("");

    return (
        <View style={styles.container}>
            <FriendForm
             onChange={(text) => setId(text)} 
             valueId={id} 
             onSubmitAdd={()=>handleAdicionar({ UserId: userCredentials.uid, FriendId: id })}
             onSubmitRemove={() => handleRemover({ UserId: userCredentials.uid, FriendId: id })}
             ></FriendForm>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#192936',
    alignItems: "center",
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