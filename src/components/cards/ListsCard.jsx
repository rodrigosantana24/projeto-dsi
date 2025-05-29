import React from 'react';
import { View, ImageBackground, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ListCard({ title, image, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.session, style]} activeOpacity={0.8}>
      <ImageBackground 
        source={image} 
        style={styles.imageBackground} 
        imageStyle={styles.imageStyle} 
        resizeMode="cover" 
      >
        <View style={styles.textContainer}>
          <Text style={styles.titleText} numberOfLines={2}>{title}</Text> 
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  session: {
    width: 180,     
    height: 300,    
    overflow: 'hidden', 
    borderRadius: 8, 
    marginRight: 15,

  },
  imageBackground: {
    flex: 1, 
    justifyContent: 'flex-end', 
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0,0.65)', 
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  titleText: { 
    color: 'white',
    fontSize: 14, 
    fontWeight: 'bold',
    textAlign: 'center',
  }
});