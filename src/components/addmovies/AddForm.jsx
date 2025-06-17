import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, SafeAreaView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const AddForm = ({ title, poster_path, genero, atores, generosList, atoresList, editandoId, onChange, onSave }) => {
  const [isGeneroModalVisible, setGeneroModalVisible] = useState(false);
  const [isAtoresModalVisible, setAtoresModalVisible] = useState(false);
  const handleSelectGenero = g => {
    onChange('genero', g);
    setGeneroModalVisible(false);
  };

  const handleToggleAtor = a => {
    const arr = atores ? atores.split(',').map(x => x.trim()) : [];
    const newArr = arr.includes(a) ? arr.filter(x => x !== a) : [...arr, a];
    onChange('atores', newArr.join(', '));
  };

  const selectedAtoresArray = atores ? atores.split(',').map(x => x.trim()) : [];

  return (
    <View style={styles.form}>
      <TextInput style={styles.input} placeholder="Título" placeholderTextColor="#888" value={title} onChangeText={t => onChange('title', t)} />
      <TextInput style={styles.input} placeholder="URL do Poster" placeholderTextColor="#888" value={poster_path} onChangeText={t => onChange('poster_path', t)} />

      <TouchableOpacity style={styles.selectButton} onPress={() => setGeneroModalVisible(true)}>
        <Text style={styles.selectButtonText}>{genero || 'Selecionar Gênero'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.selectButton} onPress={() => setAtoresModalVisible(true)}>
        <Text style={styles.selectButtonText} numberOfLines={1}>{atores || 'Selecionar Atores'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>{editandoId ? 'Atualizar' : 'Salvar'}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isGeneroModalVisible}
        onRequestClose={() => setGeneroModalVisible(false)} 
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione o Gênero</Text>
            <TouchableOpacity onPress={() => setGeneroModalVisible(false)}>
              <Icon name="x" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={generosList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalOption} onPress={() => handleSelectGenero(item)}>
                <Text style={styles.modalOptionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isAtoresModalVisible}
        onRequestClose={() => setAtoresModalVisible(false)} 
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione os Atores</Text>
            <TouchableOpacity onPress={() => setAtoresModalVisible(false)}>
              <Text style={styles.modalDoneText}>Concluir</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={atoresList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedAtoresArray.includes(item);
              return (
                <TouchableOpacity style={[styles.modalOption, isSelected && styles.modalOptionSelected]} onPress={() => handleToggleAtor(item)}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                  {isSelected && <Icon name="check" size={24} color="#00BFA5" />}
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  form: { marginBottom: 16 },
  input: { backgroundColor: '#1C3F4F', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#2a5a75' },
  
  selectButton: {
    backgroundColor: '#1C3F4F',
    borderWidth: 1,
    borderColor: '#2a5a75',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  
  saveButton: { backgroundColor: '#00BFA5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  modalContainer: {
    flex: 1,
    backgroundColor: '#071A24',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C3F4F',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalDoneText: {
    color: '#00BFA5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOption: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1C3F4F',
  },
  modalOptionSelected: {
    backgroundColor: '#102A38',
  },
  modalOptionText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default AddForm;