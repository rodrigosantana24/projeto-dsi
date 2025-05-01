import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StatusBar } from 'react-native'
import { Logo } from '../components/Logo';
import { TextInput } from '../components/TextInput';
import { LoginButton } from '../components/LoginButton';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#192936" barStyle="light-content" />
      <Logo />
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="E-mail" secure={false} iconName="mail-outline" />
      <TextInput style={styles.input} placeholder="Senha" secure={true} iconName="eye-outline" />
      <LoginButton title="Entrar" onPress={() => navigation.navigate("Home")}/>
      <Text style={styles.footerText}>
        Não tem conta? {' '}
        <Text style={styles.cadastro} onPress={() => navigation.navigate('Cadastro')}>Cadastre-se!</Text>
        </Text>
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
    fontWeight: '700',
    marginBottom: 10,
    color: '#fff'
  },
  input:{
    borderColor: "#fff",
    color: 'white',
  },
  footerText: {
    marginTop: 10,
    fontSize: 14,
    color: '#fff',
  },
  cadastro:{
    color:'#f4a03f',
    fontWeight: 'bold',
    fontSize: 16,

  }
});
