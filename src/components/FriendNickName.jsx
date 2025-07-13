import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AmigosService from '../services/AmigosService';
import getNickName from '../services/getNickName';

const amigoService = new AmigosService();

export default function FriendNickName({ userId, amigoId, style }) {
  const [nick, setNick] = useState('');
  const [tempNick, setTempNick] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getNickName({ userId, amigoId }).then((result) => {
      if (isMounted) setNick(result || '');
    });
    return () => { isMounted = false; };
  }, [userId, amigoId]);

  const handleUpdate = async () => {
    try {
      const trimmed = tempNick.trim();
      if (!trimmed || trimmed.length > 20) {
        Toast.show({
          type: 'error',
          text1: 'O apelido não pode estar vazio e deve ter no máximo 20 caracteres'
        });
        return;
      }

      await amigoService.update({
        userId: userId,
        nickName: trimmed,
        friendId: amigoId
      });

      setNick(trimmed);
      Toast.show({
        type: 'success',
        text1: 'Apelido atualizado com sucesso!'
      });
      setModalVisible(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message || "Erro ao atualizar apelido"
      });
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => {
        setTempNick(nick);
        setModalVisible(true);
      }}>
        <Text style={style}>
          {nick || "Clique para adicionar apelido"} <MaterialIcons name="edit" size={16} color="#f4a03f" />
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar apelido</Text>
            <TextInput
              style={styles.input}
              value={tempNick}
              onChangeText={setTempNick}
              maxLength={20}
              placeholder="Digite o apelido"
              fontWeight = "bold"
              placeholderTextColor={"white"}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    color: '#000',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    marginTop: 10
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#113342',
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#ffffff"
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20
  },
  cancelButton: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'red',
    borderRadius: 4
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f4a03f',
    borderRadius: 4
  },
  buttonText: {
    color: '#fff',
    fontWeight : "bold"
  }
});
