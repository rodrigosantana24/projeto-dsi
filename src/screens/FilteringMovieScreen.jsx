import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Logo } from '../components/logo/Logo';
import SearchBar from '../components/search/SearchBar';
import BottomTab from '../components/navi/BottomTab';
import HomeController from '../controllers/HomeController';
import FilteringSectionCarousel from '../components/carousels/FilteringSectionCarousel'; // importação adicionada

export default function FilteringMovieScreen({ navigation, route }) {
  const [controller] = useState(new HomeController(navigation));
  const [carregando, setCarregando] = useState(true);
  const [filmes, setFilmes] = useState([]);
  const generoId = route?.params?.generoId ?? null;
  const generoLabel = route?.params?.generoLabel ?? 'Filmes';

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const lista = await controller.getFilmesByPrimaryGenreId(generoId);
      setFilmes(lista);
      setCarregando(false);
    };
    carregar();
  }, [generoId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'←'}</Text>
        </TouchableOpacity>
        <SearchBar style={{ flex: 1, marginLeft: 10 }} />
      </View>
      <Text style={styles.sectionTitle}>{generoLabel}</Text>
      {carregando ? (
        <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 30 }} />
      ) : (
        <FilteringSectionCarousel
          title={null}
          data={filmes}
          navigation={navigation}
          contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
        />
      )}
      <View style={styles.footer}>
        <BottomTab />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#072330',
    paddingTop: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backArrow: {
    color: '#FFF',
    fontSize: 28,
    marginRight: 10,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});