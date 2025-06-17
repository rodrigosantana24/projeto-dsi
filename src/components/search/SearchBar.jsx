import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SearchBar({ onSearch, style }) {
    const [text, setText] = React.useState('');

    const handleSubmit = () => {
        if (onSearch) onSearch(text);
    };

    return (
        <View style={[styles.container, style]}>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar..."
            placeholderTextColor="#777"
            returnKeyType="search"
            underlineColorAndroid="transparent"
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSubmit}
          />
          <Feather name="search" size={20} color="#999" style={styles.icon} onPress={handleSubmit} />
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