import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native"; // Importe Dimensions
import BottomTab from '../components/navi/BottomTab';
// import { useNavigation } from '@react-navigation/native'; // Não usado aqui, pode remover se não usar mais
import MapaUsuario from "../components/map/mapaUsuario";

const { height } = Dimensions.get('window'); // Obtenha a altura da tela

export default function CineScreen() {

    // Alturas estimadas dos componentes que 'comem' espaço
    const HEADER_HEIGHT = 60; // Altura do paddingTop
    const TEXT_CONTAINER_HEIGHT = 60; // Altura do textContainer (incluindo marginBottom)
    const FOOTER_HEIGHT = 70; // Altura aproximada do BottomTab

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
        paddingTop: 60, // Este valor deve ser o mesmo usado em HEADER_HEIGHT
        paddingHorizontal: 20,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 20 // Este valor contribui para TEXT_CONTAINER_HEIGHT
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