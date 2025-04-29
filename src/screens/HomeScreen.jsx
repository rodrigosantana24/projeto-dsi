import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function HomeScreen( { navigation} ) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerBackVisible: false});
      }, [navigation]);
      
      return (
        <View style={styles.container}></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2E2E', // Cor de fundo para a tela home
  },
});