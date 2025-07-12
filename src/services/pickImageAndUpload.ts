// services/pickImageAndUpload.js
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../configs/supabase';
import { UserContext } from '../Context/UserProvider';
import { useContext } from 'react';
import Toast from 'react-native-toast-message';
import { getAvatarUrl } from './getAvatarUrl';

export default async function pickAndUploadImage({userid}) {
  
  try {
    console.log('Abrindo galeria...');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 1,
    });

    if (result.canceled) {
      Toast.show({
        type: 'error',
        text1: 'Seleção cancelada'
      });
      return getAvatarUrl(userid);
    }

    const image = result.assets[0];
    const base64 = image.base64;
    const fileName = 'avatar.jpg';
    const path = `${userid}/${fileName}`;

    const { data, error } = await supabase
      .storage
      .from('usersimages')
      .upload(path, decode(image.base64), {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao adiconar a imagem'
      });
    } else {
      Toast.show({
        type: 'success',
        text1: "Imagem salva"
      });
      
    }

    return getAvatarUrl(userid)

  } catch (err) {
    Toast.show({
        type: 'error',
        text1: 'Erro ao adiconar a imagem'
    });
  }
}
