import React from 'react';
import 'react-native-gesture-handler';
import AppNavigation from './navigation/AppNavigation';
import { UserProvider } from './Context/UserProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import CustomToast from './components/toast/CustomToast';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <UserProvider>
        <AppNavigation />
      </UserProvider>
      <Toast  config={{
          success: (props) => <CustomToast {...props} type="success" />,
          error: (props) => <CustomToast {...props} type="error" />,
        }}
        />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
