import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Logo } from '../components/Logo';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>NOME DO APP</Text>
      <TextInput placeholder="E-mail" secure={false} iconName="mail-outline" />
      <TextInput placeholder="Senha" secure={true} iconName="eye-outline" />
      <Button title="Entrar" />
      <Text style={styles.footerText}>Não tem conta? cadastre-se</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
  },
  footerText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});
