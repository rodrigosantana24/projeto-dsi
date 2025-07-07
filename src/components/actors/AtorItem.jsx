import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AtorItem = ({ ator, onEdit }) => {
  return (
      <View style={styles.container}>
        <Text style={styles.nome}>{ator.nome}</Text>
        <Text style={styles.descricao}>{ator.nacionalidade}</Text>
        <Text style={styles.descricao}>{ator.sexo}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#113342',
    padding: 12,
    borderRadius: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  descricao: {
    color: '#f4a03f',
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
    backgroundColor: '#f4a03f',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default AtorItem;