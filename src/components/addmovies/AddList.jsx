import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const AddList = ({ item, onEdit, onDelete }) => (
  <View style={styles.card}>
    {item.poster_path && (
      <Image source={{ uri: item.getImageUrl() }} style={styles.poster} />
    )}
    <View style={styles.info}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>Gênero: {item.genero}</Text>
      <Text style={styles.text}>Atores: {item.atores}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => onEdit(item)}>
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(item.id)}>
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0E2E3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EFEFEF',
    marginBottom: 8,
  },
  text: {
    color: '#B0C4DE',
    fontSize: 14,
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
});

export default AddList;