import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Constants from 'expo-constants';
import { Image, ScrollView } from 'react-native';

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

export default function MapaUsuario() {
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de localização negada");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setUserLocation(region);
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&radius=5000&type=movie_theater&key=${GOOGLE_API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
          setCinemas(data.results);
        } else {
          setErrorMsg("Nenhum cinema encontrado");
        }
      } catch (error) {
        setErrorMsg("Erro ao buscar cinemas");
      }
    })();
  }, []);
  if (errorMsg)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  if (!userLocation)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={userLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker coordinate={userLocation} title="Você está aqui" pinColor="blue" />
        {cinemas.map((cinema) => (
          <Marker
            key={cinema.place_id}
            coordinate={{
              latitude: cinema.geometry.location.lat,
              longitude: cinema.geometry.location.lng,
            }}
            title={cinema.name}
            description={cinema.vicinity}
            onPress={() => setSelectedCinema(cinema)}
          />
        ))}
      </MapView>

      {selectedCinema && (
    <ScrollView style={styles.card}>
    {selectedCinema.photos && (
      <Image
        source={{
          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${selectedCinema.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`,
        }}
        style={styles.cinemaImage}
      />
    )}
    <Text style={styles.cardTitle}>{selectedCinema.name}</Text>
    <Text style={styles.cardText}>📍 {selectedCinema.vicinity}</Text>
    {selectedCinema.rating && (
      <Text style={styles.cardText}>⭐ Avaliação: {selectedCinema.rating}</Text>
    )}
    <TouchableOpacity onPress={() => setSelectedCinema(null)}>
      <Text style={styles.cardClose}>Fechar</Text>
    </TouchableOpacity>
  </ScrollView>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: "100%",
    height: "40%",
    gap: 20
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    maxHeight: "40%",
    padding: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    marginTop: 5,
  },
  cardClose: {
    marginTop: 10,
    color: "#007AFF",
    fontWeight: "bold",
  },
  cinemaImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom:10,
  }
});
