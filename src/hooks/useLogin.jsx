// src/hooks/useLogin.js
<<<<<<< HEAD
import { useState } from 'react';
import { signInWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';
import { getFirebaseErrorMessage } from '../errors/getFirebaseErrorMessage';

=======
import { useContext, useState } from 'react';
import { signInWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';
import { getFirebaseErrorMessage } from '../errors/getFirebaseErrorMessage';
import { UserContext } from '../Context/UserProvider';
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f

export function useLogin(navigation) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);
  const [data, setData]           = useState(null);
  const {setUserCredentials} = useContext(UserContext); 

  const handleLogin = async (email, password) => {
    if (!validateInput(email,password)) {
      return
  }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth , email, password );
      const user = userCredential.user;
<<<<<<< HEAD
      setData(user);
=======
      setUserCredentials(user)
>>>>>>> 9ca0c5da9e4a84918b9b873398ca965b5c40ef5f
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
