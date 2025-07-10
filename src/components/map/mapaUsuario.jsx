import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Dimensions, FlatList } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Constants from 'expo-constants';
import { Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_API_KEY;

const { height } = Dimensions.get('window'); 

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

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&radius=10000&type=movie_theater&key=${GOOGLE_API_KEY}`;
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

  const renderCinemaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => setSelectedCinema(item)}
    >
      <Ionicons name="film-outline" size={24} color="#f4a03f" style={styles.listItemIcon} />
      <View style={styles.listItemTextContainer}>
        <Text style={styles.listItemTitle}>{item.name}</Text>
        <Text style={styles.listItemVicinity}>{item.vicinity}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  if (errorMsg)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  if (!userLocation)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f4a03f" />
      </View>
    );

  return (
    <View style={styles.mainContainer}> 
      <MapView
        style={styles.map}
        region={userLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={() => setSelectedCinema(null)}
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

      {selectedCinema ? (
        <ScrollView style={styles.cinemaDetailCard} contentContainerStyle={styles.cinemaDetailCardContent}>
          {selectedCinema.photos && selectedCinema.photos.length > 0 && (
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
          {selectedCinema.opening_hours && selectedCinema.opening_hours.open_now !== undefined && (
            <Text style={styles.cardText}>
              {selectedCinema.opening_hours.open_now ?
               <Text style={{color: '#4CAF50'}}>🟢 Aberto agora</Text> :
               <Text style={{color: '#FF6347'}}>🔴 Fechado agora</Text>}
            </Text>
          )}
          <TouchableOpacity style={styles.cardCloseButton} onPress={() => setSelectedCinema(null)}>
            <Text style={styles.cardCloseButtonText}>Voltar para a Lista</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={cinemas}
          renderItem={renderCinemaItem}
          keyExtractor={(item) => item.place_id}
          contentContainerStyle={styles.cinemaListContent} 
          ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum cinema encontrado por perto.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    width: '100%',
  },
  map: {
    width: "100%",
    height: height * 0.30,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15, 
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#072330',
  },
  error: {
    color: "#FF6347",
    fontSize: 16,
  },
  cinemaDetailCard: {
    flex: 1, 
    backgroundColor: "#192936",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    minHeight: 440,
  },
  cinemaDetailCardContent: {
    flexGrow: 1, 
    paddingBottom: 15, 
  },
  cinemaImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 15,
    marginTop: 3,
    color: "#ccc",
  },
  cardCloseButton: {
    marginTop: 20,
    backgroundColor: "#f4a03f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  cardCloseButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cinemaListContent: { 
    flexGrow: 1,
    paddingVertical: 15,
    paddingBottom: 15, 
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#113342',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  listItemIcon: {
    marginRight: 15,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemVicinity: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 3,
  },
  emptyListText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  }
});