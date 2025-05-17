import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export function Logo({ style = {} }) {
  return (
    <View style={styles.logoContainer}>
      <Image source={require('../assets/ruralflix.png')} style={[styles.logo, style]} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
});