// src/hooks/useLogin.js
import { useState } from 'react';
import { signInWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';
import { getFirebaseErrorMessage } from '../errors/getFirebaseErrorMessage';


export function useLogin(navigation) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);
  const [data, setData]           = useState(null);

  const handleLogin = async (email, password) => {
    if (!validateInput(email,password)) {
      return
  }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth , email, password );
      const user = userCredential.user;
      setData(user);
      navigation.navigate("Home"); // Navega para a tela Home
    } catch (err) {
      const messageApi = getFirebaseErrorMessage(err.code)
      setError(messageApi);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = (email,password)=>{
    setError(null)
    if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido');
      return false;
    }
    return true;
  }

  return { isLoading, error, data, handleLogin };

}
