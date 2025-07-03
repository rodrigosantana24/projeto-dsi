import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchGeneric({ onSearch, placeholder = "Pesquisar...", value }) {
  const handleSearchChange = (text) => {
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        value={value}
        onChangeText={handleSearchChange}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#3d5564',
    fontSize: 16,
    borderRadius: 6,
    padding: 14,
    color: '#FFF',
    
  },
});