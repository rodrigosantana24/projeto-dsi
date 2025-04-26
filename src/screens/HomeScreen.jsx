import React from 'react';
import { View } from 'react-native';

export default function HomeScreen( { navigation} ) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerBackVisible: false});
      }, [navigation]);
    return (
        <View></View>
  );
}