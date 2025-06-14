import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GeneroItem = ({ genero, onEdit, onDelete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{genero.nome}</Text>
      <Text style={styles.descricao}>{genero.descricao}</Text>
      {genero.nativo ? (
        <Text style={styles.nativo}>Gênero nativo</Text>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#243b4a',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  descricao: {
    color: '#BBB',
    marginBottom: 4,
  },
  nativo: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#FFD700',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default GeneroItem;