import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Logo } from '../components/Logo';
import { TextInput } from '../components/TextInput';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>RuralFlix</Text>
      <TextInput placeholder="E-mail" secure={false} iconName="mail-outline" />
      <TextInput placeholder="Senha" secure={true} iconName="eye-outline" />
      <Button title="Entrar" onPress={()=> navigation.navigate('Home')}/>
      <Text style={styles.footerText}>Não tem conta? cadastre-se</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: '#192936',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 30,
  },
  footerText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});
