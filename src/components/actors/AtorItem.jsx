import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AtorItem = ({ ator, onEdit, onDelete }) => {
return (
    <View style={styles.container}>
        <Text style={styles.nome}>{ator.nome}</Text>
        <Text style={styles.descricao}>{ator.nacionalidade}</Text>
        <Text style={styles.descricao}>{ator.sexo}</Text>
        <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
                <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
                <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
        </View>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#113342',
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