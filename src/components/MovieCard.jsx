import React from 'react';
import { View, ImageBackground, Text, StyleSheet } from 'react-native';

export default function MovieCard({ title, image }) {
  return (
    <View style={styles.session}>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    session: {
      width: 250,
      height: 150,
      overflow: 'hidden',
      marginRight: 15,
    },
    image: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    textContainer: {
      padding: 10,
    },
    title: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    }
  });