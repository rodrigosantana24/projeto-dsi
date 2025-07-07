import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import BottomTab from '../components/navi/BottomTab';
import { useNavigation } from '@react-navigation/native';
import MapaUsuario from "../components/map/mapaUsuario";

export default function CineScreen() {
    
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}> 
                <Text style={styles.textCine}>Cinemas mais próximos</Text>
            </View>
            <SafeAreaView style={{ flex: 1}}>
                <MapaUsuario />
            </SafeAreaView>
            <View style={styles.footer}>
                <BottomTab/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#072330',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom:20
    },
    textCine: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    }

});