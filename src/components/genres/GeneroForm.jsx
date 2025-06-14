import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const GeneroForm = ({ nome, descricao, onChangeNome, onChangeDescricao, onSubmit, editandoId, title = 'Adicionar Gênero', onCancel }) => {
  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>{title}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Gênero"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={onChangeNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#999"
        value={descricao}
        onChangeText={onChangeDescricao}
      />
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>{editandoId ? 'Atualizar' : 'Salvar'}</Text>
      </TouchableOpacity>
      {onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#243b4a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3d5564',
    borderRadius: 6,
    padding: 10,
    color: '#FFF',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1abc9c',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default GeneroForm;