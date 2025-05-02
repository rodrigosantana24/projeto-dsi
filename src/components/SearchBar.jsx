import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SearchBar() {
    return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar..."
            placeholderTextColor="#777"
            returnKeyType="search"
            underlineColorAndroid="transparent"
          />
          <Feather name="search" size={20} color="#999" style={styles.icon} />
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
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 14,
  },
});