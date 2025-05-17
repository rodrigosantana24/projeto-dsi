// src/screens/SingUpScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, StatusBar } from 'react-native';
import { Logo } from '../components/logo/Logo';
import { LoginTextInput } from '../components/inputs/LoginTextInput';
import { PasswordTextInput } from '../components/inputs/PasswordTextInput';
import { LoginButton } from '../components/buttons/LoginButton';
import { useSignUp } from '../hooks/useSignUp';


export default function SingUpScreen({ navigation }) {
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isLoading, error, handleSignUp }  = useSignUp(navigation);

  const singUp = () => {
    handleSignUp(name, email, password, confirmPassword)
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#192936" barStyle="light-content" />
      <Logo style={{ width: 150, height: 150 }} />
      <Text style={styles.title}>Cadastro</Text>

      <LoginTextInput
        valueText={name}
        onChangeText={setName}
        placeHolder="Nome"
        iconName="person"
      />
      <LoginTextInput
        valueText={email}
        onChangeText={setEmail}
        placeHolder="E‑mail"
        iconName="mail-outline"
      />
      <PasswordTextInput
        valueText={password}
        onChangeText={setPassword}
        placeHolder="Senha"
      />
      <PasswordTextInput
        valueText={confirmPassword}
        onChangeText={setConfirmPassword}
        placeHolder="Confirmar Senha"
      />

      <LoginButton
        title={isLoading ? 'Cadastrando...' : 'Cadastrar'}
        disabled={isLoading}
        onPress={singUp}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <Text style={styles.footerText}>
        Já tem conta?{' '}
        <Text
          style={styles.cadastro}
          onPress={() => navigation.navigate('Login')}
        >
          Faça o Login!
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 40, backgroundColor: '#192936', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 10, color: '#fff' },
  footerText: { marginTop: 10, fontSize: 14, color: '#fff' },
  cadastro: { color: '#f4a03f', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#D32F2F', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  errorContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.237)',
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
    width: '100%',
  },
});
