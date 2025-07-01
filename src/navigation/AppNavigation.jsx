import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SingUpScreen from '../screens/SingUpScreen';
import CineScreen from '../screens/CineScreen';
import ToScheduleScreen from '../screens/ToScheduleScreen';
import MenuScreen from '../screens/MenuScreen';
import FavoriteMovieScreen from '../screens/FavoriteMovieScreen';
import AddMovieScreen from '../screens/AddMovieScreen';
import ManageGenresScreen from '../screens/ManageGenresScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FriendList from '../screens/FriendList';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import AddFriend from '../screens/AddFriend';
import FilteringMovieScreen from '../screens/FilteringMovieScreen';
import ActorsListScreen from '../screens/ActorsListScreen';
import ActorFormScreen from '../screens/ActorFormScreen';



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
          name="FavoriteMovieScreen" 
          component={FavoriteMovieScreen}
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
        <Stack.Screen
          name='AddFriend'
          component={AddFriend}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name='ToScheduleScreen'
          component={ToScheduleScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name='FilteringMovieScreen'
          component={FilteringMovieScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ActorsListScreen"
          component={ActorsListScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ActorFormScreen"
          component={ActorFormScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;