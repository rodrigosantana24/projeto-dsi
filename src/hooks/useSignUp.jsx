// src/hooks/useSignUp.js
import { useState } from 'react';
import { Alert } from 'react-native';
import { mockSignUp } from '../services/authService';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../configs/firebaseConfig';
import { getFirebaseErrorMessage } from '../errors/getFirebaseErrorMessage';

export function useSignUp(navigation) { // Recebe navigation como parâmetro
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (name, email, password, confirmPassword) => {
    if (!validateInput(name, email, password, confirmPassword)) {
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword( auth, email, password );
      const uid = userCredential.user.uid;
      
      await set(ref(database,`usuarios/${uid}`),{
        amigos:[],
        cinemas:[],
        email,
        favoritos:[2,3,5],
        filmes:[2,3,4],
        name
      })


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

    } catch (err) {
      const messageError = getFirebaseErrorMessage(err)
      setError(messageError);
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

  return { isLoading, error, handleSignUp };
}
