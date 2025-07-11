import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AddList = ({ item }) => {
  const generosNomes = item.generos && item.generos.length > 0
    ? item.generos.map(g => g.nome).join(', ')
    : 'Não informado';

  const atoresNomes = item.atores && item.atores.length > 0
    ? item.atores.map(a => a.nome).join(', ')
    : 'Não informado';

  return (
    <View style={styles.itemContainer}>
      <Image 
        source={item.poster_path ? { uri: item.poster_path } : require('../../assets/logo/ruralflix.png')} 
        style={styles.poster} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>Gêneros: {generosNomes}</Text>
        <Text style={styles.details}>Atores: {atoresNomes}</Text>
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
        backgroundColor: '#0A1E29', 
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