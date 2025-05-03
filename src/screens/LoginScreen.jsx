import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoginButton } from '../components/LoginButton';
import { Logo } from '../components/Logo';
import { PasswordTextInput } from '../components/PasswordTextInput';
import { useLogin } from '../hooks/useLogin';
import { useState } from 'react';
import { LoginTextInput } from '../components/LoginTextInput';
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(); 
  const {isLoading,error,data,handleLogin} = useLogin(navigation)


  const login = ()=>{
    handleLogin(email,password)
  }

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>RuralFlix</Text>
      <LoginTextInput
        valueText={email}
        onChangeText={setEmail}
        placeHolder={"Login"} 
        secure={false}
        iconName="mail-outline" />
      <PasswordTextInput
        valueText={password}
        onChangeText={setPassword}
        placeHolder={"Password"}
        secure={true}
        iconName="eye-outline" />
      <LoginButton
         title={isLoading ? "Carregando..." : "Entrar"} 
         disabled={isLoading}
         onPress={login}/>
         

      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.footerText}>
        Não tem conta? {' '}
        <Text style={styles.cadastro} onPress={() => navigation.navigate('SingUp')}>Cadastre-se!</Text>
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

  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});