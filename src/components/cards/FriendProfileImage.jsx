import React, { useEffect ,useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getAvatarUrl } from '../../services/getAvatarUrl';

export default function FriendProfileImage({ 
  friendId,
  size = 60, 
  style,
}){
    const [source , setSource] =useState(null)

    useEffect(()=>{
      getAvatarUrl(friendId)
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
  </TouchableOpacity>
);

}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#e1e1e1', // cor de fundo caso a imagem não carregue
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
