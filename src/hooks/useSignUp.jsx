// src/hooks/useSignUp.js
import { useState } from 'react';
import { Alert } from 'react-native';
import { mockSignUp } from '../services/authService';

export function useSignUp(navigation) { // Recebe navigation como parâmetro
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSignUp = async (name, email, password, confirmPassword) => {
    if (!validateInput(name, email, password, confirmPassword)) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await mockSignUp({ name, email, password });
      setData(res);

      // Exibe o Alert de sucesso e redireciona após o usuário pressionar "OK"
      Alert.alert(
        'Sucesso',
        'Cadastro realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'), // Redireciona ao pressionar "OK"
          },
        ]
      );

      return res;
    } catch (err) {
      setError(err.message);

      // Exibe o Alert de erro
      Alert.alert('Erro', 'Erro ao realizar o cadastro. Tente novamente!');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = (name, email, password, confirmPassword) => {
    setError(null);
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido');
      return false;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    return true;
  };

  return { isLoading, error, data, handleSignUp };
}
