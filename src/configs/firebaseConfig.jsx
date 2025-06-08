import {initializeApp} from "firebase/app"
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth'; 
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initAuth } from "./initAuth";
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app,
  {
    persistence : getReactNativePersistence(AsyncStorage),
  }
);
const database = getDatabase(app)

export {auth,database}