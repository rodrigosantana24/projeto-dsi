import React, { useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import pickAndUploadImage from '../../services/pickImageAndUpload';
import { UserContext } from '../../Context/UserProvider';
import { useContext , useState} from 'react';
import { getAvatarUrl } from '../../services/getAvatarUrl';

export default function ProfileImage({ 
  size = 65, 
  onPress, 
  style,
  children 
}){
    const { userCredentials, setUserCredentials } = useContext(UserContext);
    const [source , setSource] =useState(null)

    useEffect(()=>{
      getAvatarUrl(userCredentials.uid)
      .then((url)=> setSource(url));
    },[])


    const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    };

    {!source && (
        <MaterialIcons name='person' size={size* 0.6} color={"#666"}></MaterialIcons>
    )}

    return (
  <TouchableOpacity 
    onPress={
      async () => {
        const newUrl = await pickAndUploadImage({userid:userCredentials.uid}) 
        setSource(newUrl)
      }
    }
    style={[styles.container, containerStyle, style]}
  >
    {!source && (
      <MaterialIcons name='person' size={size * 0.6} color={"#666"} />
    )}

    {source && (
      <Image
        source={{uri : source}}
        style={[styles.image, containerStyle]}
        resizeMode="cover"
      />
    )}

    {children}
  </TouchableOpacity>
);

}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#e1e1e1', // cor de fundo caso a imagem não carregue
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
