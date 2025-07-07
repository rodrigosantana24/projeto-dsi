import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GeneroItem = ({ genero, onEdit }) => {
  const isNativo = genero.nativo === true || genero.nativo === 'n';

  return (
    <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
      <View style={styles.container}>
        <Text style={styles.nome}>{genero.nome}</Text>
        <Text style={styles.descricao}>{genero.descricao}</Text>
        <Text style={styles.nativo}>
          {isNativo ? 'Gênero nativo' : ' '}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#113342',
    padding: 12,
    borderRadius: 8
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
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default GeneroItem;