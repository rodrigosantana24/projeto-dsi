import React from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet } from 'react-native';
=======
import { View } from 'react-native';
>>>>>>> 21e33114c7dae7041f1aba0ee8d23b4a841c43cd

export default function HomeScreen( { navigation} ) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerBackVisible: false});
      }, [navigation]);
<<<<<<< HEAD
    
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
=======
    return (
        <View></View>
  );
}
>>>>>>> 21e33114c7dae7041f1aba0ee8d23b4a841c43cd
