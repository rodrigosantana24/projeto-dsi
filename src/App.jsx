import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import { UserProvider } from './Context/UserProvider';

export default function App() {
  return ( 
    <UserProvider> 
      <AppNavigation/>
    </UserProvider>

)}
