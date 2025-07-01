import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GeneroItem = ({ genero, onEdit }) => {
  const isNativo = genero.nativo === true || genero.nativo === 'n';

  return (
    <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
      <View style={styles.container}>
        <Text style={styles.nome}>{genero.nome}</Text>
        <Text style={styles.descricao}>{genero.descricao}</Text>
        {isNativo && <Text style={styles.nativo}>Gênero nativo</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#113342',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    minHeight: 80
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

export default GeneroItem;