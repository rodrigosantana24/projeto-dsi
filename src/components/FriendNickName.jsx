import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AmigosService from '../services/AmigosService';
import { TouchableOpacity } from 'react-native';
import getNickName from '../services/getNickName';

const amigoService = new AmigosService();
export default function FriendNickName({ userId, amigoId, style }) {
  const [nick, setNick] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getNickName({ userId, amigoId }).then((result) => {
      if (isMounted) setNick(result || '');
    });
    return () => { isMounted = false; };
  }, [userId, amigoId]);

  const handleUpdate = async() => {
    try {
      if (!nick.trim() || nick.trim().length > 20) {
        Toast.show({
          type: 'error',
          text1: 'O apelido não pode estar vazio e deve ter no máximo 20 caracteres'
        });
        return;
      }

      await amigoService.update({
        userId: userId,
        nickName: nick,
        friendId: amigoId
      });
      
      Toast.show({
        type: 'success',
        text1: 'Apelido atualizado com sucesso!'
      });
      setIsEditing(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message || "Erro ao atualizar apelido"
      });
    }
  };

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Apelido :</Text>
      </View>
      
      {isEditing ? (
        <TextInput 
          style={[style, styles.input]}
          value={nick}
          onChangeText={setNick}
          autoFocus
          onSubmitEditing={handleUpdate}
          onBlur={handleUpdate}
        />
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Text style={style}>{nick || "Clique para adicionar apelido"} <MaterialIcons name="edit" size={16} color="#f4a03f" /></Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  titleText: {
    fontWeight: 'bold', 
    color: 'white', 
    fontSize: 16,
    
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc'
  }
});