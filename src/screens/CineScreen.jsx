import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomTab from '../components/navi/BottomTab';
import { useNavigation } from '@react-navigation/native';

export default function CineScreen() {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#192936' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 24 }}>CineScreen</Text>
            </View>

            <View style={styles.footer}>
                <BottomTab/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#192936',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
}
});