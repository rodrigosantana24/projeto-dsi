import React, { useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { Logo } from '../components/Logo';
import { Button } from 'react-native';
import MockLogin from '../mock/MockLogin'
import { Alert } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { TextInput } from 'react-native-gesture-handler';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(); 
  const {isLoading,error,data,handleLogin} = useLogin()



  const login = ()=>{
    console.log("Botão pressionado - email:", email, "senha:", password);
    handleLogin(email,password)
  }


  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>NOME DO APP</Text>
      
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        iconName="mail-outline"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Senha" 
        secureTextEntry={true}
        iconName="eye-outline"
      />

      <Button
        title={isLoading ? "Carregando" : "Entrar"} 
        onPress={login}
        disabled={isLoading}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      
      <TouchableOpacity 
            style={styles.container} 
            onPress={()=>Alert.alert("Criar conta")
            }
      >
          <Text>
            Crie a sua Conta
          </Text>
      </TouchableOpacity>
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