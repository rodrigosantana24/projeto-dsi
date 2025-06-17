import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddForm = ({ title, poster_path, genero, atores, editandoId, onChange, onSave }) => (
  <View style={styles.form}>
    <TextInput
      style={styles.input}
      placeholder="Título do Filme"
      placeholderTextColor="#888"
      value={title}
      onChangeText={(t) => onChange('title', t)}
    />
    <TextInput
      style={styles.input}
      placeholder="URL do Poster"
      placeholderTextColor="#888"
      value={poster_path}
      onChangeText={(t) => onChange('poster_path', t)}
    />
    <TextInput
      style={styles.input}
      placeholder="Gênero"
      placeholderTextColor="#888"
      value={genero}
      onChangeText={(t) => onChange('genero', t)}
    />
    <TextInput
      style={styles.input}
      placeholder="Atores (separados por vírgula)"
      placeholderTextColor="#888"
      value={atores}
      onChangeText={(t) => onChange('atores', t)}
    />
    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
      <Text style={styles.saveButtonText}>
        {editandoId ? 'Atualizar Filme' : 'Salvar Filme'}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1C3F4F',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a5a75'
  },
  saveButton: {
    backgroundColor: '#00BFA5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddForm;
