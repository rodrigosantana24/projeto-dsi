import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native"; 
import BottomTab from '../components/navi/BottomTab';
import MapaUsuario from "../components/map/mapaUsuario";

const { height } = Dimensions.get('window'); 

export default function CineScreen() {
    const HEADER_HEIGHT = 60; 
    const TEXT_CONTAINER_HEIGHT = 60; 
    const FOOTER_HEIGHT = 70; 

    const mapUserAvailableHeight = height - HEADER_HEIGHT - TEXT_CONTAINER_HEIGHT - FOOTER_HEIGHT;
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.textCine}>Cinemas mais próximos</Text>
            </View>
            <SafeAreaView style={{ height: mapUserAvailableHeight }}> 
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
        marginBottom: 20 
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