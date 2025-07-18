import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomToast({ text1, type }) {
  return (
    <View style={[styles.container, type === 'error' ? styles.error : styles.success]}>
      <Text style={styles.text}>{text1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 4,
    marginHorizontal: 16,
    marginTop: 40,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#28a745',
  },
  error: {
    backgroundColor: '#dc3545',
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});