import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text} from 'react-native'
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location'

export default function MapaUsuario() {
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  if (errorMsg) return <Text>{errorMsg}</Text>;
  if (!userLocation) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={userLocation}>
        <Marker coordinate={userLocation} title="Você está aqui" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { 
    width:'100%',
    height: 300
},
});