import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AddList = ({ item }) => {
  const generoNomes = item.generos?.map(g => g.nome).join(', ') || 'N/A';
  const atorNomes = item.atores?.map(a => a.nome).join(', ') || 'N/A';

  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.poster_path }} style={styles.poster} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>Gênero: {generoNomes}</Text>
        <Text style={styles.details}>Atores: {atorNomes}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#113342',
        padding: 10,
        marginVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1C3F4F',
        alignItems: 'center',
    },
    poster: {
        width: 60,
        height: 90,
        borderRadius: 4,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        color: '#EFEFEF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    details: {
        color: '#B0B0B0',
        fontSize: 14,
    },
});

export default AddList;