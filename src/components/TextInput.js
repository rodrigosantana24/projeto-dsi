import React from 'react';
import { View, TextInput as RNInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function TextInput({ placeholder, secure, iconName }) {
  return (
    <View style={styles.container}>
      <RNInput
        placeholder={placeholder}
        secureTextEntry={secure}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <Ionicons name={iconName} size={20} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 8,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
    color: '#666',
  },
});
