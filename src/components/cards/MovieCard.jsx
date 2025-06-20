import React from 'react';
import { View, ImageBackground, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MovieCard({ id, title, image, onPress}) {
  return (
    <TouchableOpacity 
      onPress={() => onPress(id)} 
      style={styles.session}
    >
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    session: {
      width: 125,
      height: 180,
      overflow: 'hidden',
      marginRight: 15,
      borderRadius: 4,
    },
    image: {
      flex: 1,
      justifyContent: 'flex-end',
      resizeMode: 'cover',
    },
    textContainer: {
      position: 'absolute',
      right: 1,
      bottom: 4,
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },
    title: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    }
  });