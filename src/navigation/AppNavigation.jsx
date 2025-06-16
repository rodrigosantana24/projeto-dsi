import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SingUpScreen from '../screens/SingUpScreen';
import CineScreen from '../screens/CineScreen';
import MenuScreen from '../screens/MenuScreen';
import WatchLaterScreen from '../screens/WatchLaterScreen';
import AddMovieScreen from '../screens/AddMovieScreen';
import ManageGenresScreen from '../screens/ManageGenresScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FriendList from '../screens/FriendList';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = ()=> {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
            name="Login" component={LoginScreen}
            options={{headerShown : false}}
           />
        <Stack.Screen
           name="Home" component={HomeScreen}
           options={{headerShown : false}}
           />
        <Stack.Screen
           name="SingUp" 
           component={SingUpScreen} 
           options={{ headerShown: false }}
        />
        <Stack.Screen
           name="CineScreen" 
           component={CineScreen} 
           options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WatchLaterScreen" 
          component={WatchLaterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddMovieScreen" 
          component={AddMovieScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ManageGenresScreen" 
          component={ManageGenresScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name='FriendList'
          component={FriendList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name='MovieDetailsScreen'
          component={MovieDetailsScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;