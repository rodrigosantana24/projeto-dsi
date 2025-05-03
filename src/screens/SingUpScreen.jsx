import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StatusBar } from 'react-native'
import { Logo } from '../components/Logo';
import { LoginTextInput } from '../components/LoginTextInput';
import { PasswordTextInput } from '../components/PasswordTextInput';
import { LoginButton } from '../components/LoginButton';

export default function SingUpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#192936" barStyle="light-content" />
      <Logo />
      <Text style={styles.title}>Cadastro</Text>
      <LoginTextInput placeHolder={"Nome"} iconName={"person"}/>
      <LoginTextInput placeHolder={"E-mail"} iconName={"mail-outline"} />
      <PasswordTextInput placeHolder={"Senha"} />
      <PasswordTextInput  placeHolder={"Confirmar Senha"}/>
      
      <LoginButton title="Cadastrar" onPress={() => navigation.navigate("Home")}/>
        <Text style={styles.footerText}>
                Já tem conta? {' '}
                <Text style={styles.cadastro} onPress={() => navigation.navigate('Login')}>Faça o Login!</Text>
                </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
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