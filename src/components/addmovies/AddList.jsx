import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AddList = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: item.poster_path || 'https://via.placeholder.com/60x90.png?text=S/I' }} 
        style={styles.poster} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title || 'Título não disponível'}</Text>
        <Text style={styles.details}>Gêneros: {item.genero || 'Não informado'}</Text>
        <Text style={styles.details}>Atores: {item.atores || 'Não informado'}</Text>
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
        backgroundColor: '#072330', 
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

export default React.memo(AddList);