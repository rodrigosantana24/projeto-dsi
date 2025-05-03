import React, { useState } from 'react';
import { View, TextInput as RNInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function PasswordTextInput({placeHolder,onChangeText,value}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <RNInput
        placeholder={placeHolder}
        placeholderTextColor="#999"
        secureTextEntry={!showPassword}
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
      />
      
      <TouchableOpacity
         onPress={() => setShowPassword(!showPassword)}>
        <Ionicons
          name={showPassword ? 'eye' : 'eye-off'}
          size={20}
          style={styles.icon}
        />
      </TouchableOpacity>
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
    color: "#fff",
  },
  icon: {
    marginLeft: 10,
    color: '#fff',
  },
});