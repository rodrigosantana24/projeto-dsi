import { Alert } from "react-native";
import { useState } from "react";
import MockLogin from "../mock/MockLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


export const useLogin = ()=>{
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data,setData] = useState(null)

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

  const handleLogin = async (email,password) =>{
    if (!validateInput(email,password)) {
        return
    }    
    setIsLoading(true)

    try {
      const response = await MockLogin(email, password);
      setData(response);
      await AsyncStorage.setItem('userToken', String(response.token)); // Se necessário
      navigation.navigate("Home");

    } catch (error) {
        setError(error.message)
        Alert.alert("error",error.message)
    }finally{
        Alert.alert("Hello")
        setIsLoading(false)
    }

  }


  return{
    isLoading,
    error,
    data,
    handleLogin
  }
}