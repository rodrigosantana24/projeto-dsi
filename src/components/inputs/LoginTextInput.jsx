import React from 'react';
import { View, TextInput as RNInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function LoginTextInput({ placeHolder, iconName ,onChangeText,value}) {
  return (
    <View style={styles.container}>
      <RNInput
        placeholder={placeHolder}
        style={styles.input}
        placeholderTextColor="#999"
        onChangeText={onChangeText}
        value={value}
      />
      <Ionicons name={ iconName } size={20} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 15,
    marginVertical: 8,
    height: 50,
    
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  icon: {
    marginLeft: 10,
    color: '#fff',
  },
});