import Toast from "react-native-toast-message";
import { supabase } from "../configs/supabase";

export async function getAvatarUrl(userId) {
    const {data , error} = supabase
        .storage
        .from("usersimages")
        .getPublicUrl(`${userId}/avatar.jpg`)

    if(error){
        Toast.show({
            type: 'error',
            text1: 'Erro ao adiconar a imagem'
      });
    }
    
    return `${data.publicUrl}?t=${Date.now()}`;l;
}