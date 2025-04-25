import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export function Logo() {
  return (
    <View style={styles.logoContainer}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
});