import {initializeApp} from "firebase/app"
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; 
import { getDatabase, ref, onValue } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDkmcXGRg13M_IaU1CXbBhgDLJ2NiodSLE",
  authDomain: "http://testfirebase-8eaa7.firebaseapp.com",
  databaseURL: "https://testfirebase-8eaa7-default-rtdb.firebaseio.com",
  projectId: "testfirebase-8eaa7",
  storageBucket: "http://testfirebase-8eaa7.firebasestorage.app",
  messagingSenderId: "173905417119",
  appId: "1:173905417119:web:0c4aa9e408553b867c23aa",
  measurementId: "G-YMT1RWS53P"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app,
  {
    persistence : getReactNativePersistence(AsyncStorage),
  }
);
const database = getDatabase(app)

export {auth,database}