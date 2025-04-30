import React from 'react';
import { View, ImageBackground, Text, StyleSheet } from 'react-native';

export default function MovieCard({ title, image }) {
  return (
    <View style={styles.card}>
      <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
      width: 250,
      height: 150,
      borderRadius: 12,
      overflow: 'hidden',
      marginRight: 15,
    },
    image: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    imageStyle: {
      borderRadius: 12,
    },
    textContainer: {
      padding: 20,
    },
    title: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    }
  });