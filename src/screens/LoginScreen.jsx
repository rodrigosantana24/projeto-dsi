import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoginButton } from '../components/buttons/LoginButton';
import { Logo } from '../components/logo/Logo';
import { PasswordTextInput } from '../components/inputs/PasswordTextInput';
import { useLogin } from '../hooks/useLogin';
import { useState } from 'react';
import { LoginTextInput } from '../components/inputs/LoginTextInput';
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
        placeHolder={"Email"} 
        secure={false}
        iconName="mail-outline" />
      <PasswordTextInput
        valueText={password}
        onChangeText={setPassword}
        placeHolder={"Senha"}
        secure={true}
        iconName="eye-outline" />
      <LoginButton
         title={isLoading ? "Carregando..." : "Entrar"} 
         disabled={isLoading}
         onPress={login}/>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
         
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
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.237)',
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 4,
    padding: 8,
    marginTop: 10,
    width: '100%',
  },
});