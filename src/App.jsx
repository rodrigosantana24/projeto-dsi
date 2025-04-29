import React from 'react';
<<<<<<< HEAD
import AppNavigation from './navigation/AppNavigation';

export default function App() {
  return <AppNavigation></AppNavigation>;
=======
import { SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
>>>>>>> 21e33114c7dae7041f1aba0ee8d23b4a841c43cd
}
