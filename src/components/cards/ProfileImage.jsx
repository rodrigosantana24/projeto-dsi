import React, { useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import pickAndUploadImage from '../../services/pickImageAndUpload';
import { UserContext } from '../../Context/UserProvider';
import { useContext , useState} from 'react';
import { getAvatarUrl } from '../../services/getAvatarUrl';

export default function ProfileImage({ 
  size = 70, 
  onPress, 
  style,
  children 
}) {
  const { userCredentials } = useContext(UserContext);
  const [source, setSource] = useState(null);

  useEffect(() => {
    getAvatarUrl(userCredentials.uid)
      .then((url) => setSource(url));
  }, []);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.wrapper, style]}>
      <TouchableOpacity
        onPress={async () => {
          const newUrl = await pickAndUploadImage({ userid: userCredentials.uid });
          setSource(newUrl);
        }}
        style={[styles.container, containerStyle]}
      >
        {!source && (
          <MaterialIcons name='person' size={size * 0.6} color={"#666"} />
        )}

        {source && (
          <Image
            source={{ uri: source }}
            style={[styles.image, containerStyle]}
            resizeMode="cover"
          />
        )}

        {children}
      </TouchableOpacity>

      {/* Ícone de edição fora da imagem */}
      <TouchableOpacity onPress={onPress} style={styles.editIconContainer}>
        <MaterialIcons name="edit" size={16} color="white"/>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    overflow: 'hidden',
    backgroundColor: '#334455',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: -5, // posição fora da imagem
    right: -5,  // posição fora da imagem
    backgroundColor: '#334455',
    borderRadius: 12,
    padding: 4,
    zIndex: 10,
  },
});

