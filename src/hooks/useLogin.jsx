// src/hooks/useLogin.js
import { useState } from 'react';
import { mockLogin } from '../services/authService';

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
      const res = await mockLogin({ email, password });
      setData(res);
      if (res.response === "ok") {
        navigation.navigate("Home"); // Navega para a tela Home
      }
    } catch (err) {
      setError(err.message);
      throw err;
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
