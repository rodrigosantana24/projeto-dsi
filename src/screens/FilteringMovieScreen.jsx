import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import SearchBar from '../components/search/SearchBar';
import BottomTab from '../components/navi/BottomTab';
import HomeController from '../controllers/HomeController';
import FilteringSectionCarousel from '../components/carousels/FilteringSectionCarousel';
import HeaderBar from '../components/navi/HeaderBar';
import FilterChips from '../components/chips/FilterChips';

export default function FilteringMovieScreen({ navigation, route }) {
  const [controller] = useState(new HomeController(navigation));
  const [carregando, setCarregando] = useState(true);
  const [filmes, setFilmes] = useState([]);
  const generoId = route?.params?.generoId ?? 0;
  const generoLabel = route?.params?.generoLabel ?? 'Filmes';
  const searchTerm = route?.params?.searchTerm ?? null;

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      let lista = [];
      if (searchTerm) {
        lista = await controller.searchFilmesByName(searchTerm);
      } else {
        lista = await controller.getFilmesByPrimaryGenreId(generoId);
      }
      setFilmes(lista);
      setCarregando(false);
    };
    carregar();
  }, [generoId, searchTerm]);

  return (
    <View style={styles.container}>
        <HeaderBar
          title="Pesquisar Filmes"
          onBack={() => navigation.goBack()}
        />
      <View style={styles.header}>
        <SearchBar
          style={{ width: '100%' }}
          onSearch={(searchTerm) => {
            navigation.navigate('FilteringMovieScreen', {
              searchTerm,
              generoId: null,
              generoLabel: 'Resultados',
            });
          }}
        />
          <FilterChips
            filters={controller.getFiltros()}
            onSelect={(filter) => {
              navigation.navigate('FilteringMovieScreen', { generoId: filter.id, generoLabel: filter.label });
            }}
          />
      </View>
      {carregando ? (
        <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 30 }} />
      ) : (
        <FilteringSectionCarousel
          title={null}
          data={filmes}
          navigation={navigation}
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
    padding: 16,
    paddingTop: 25,
    backgroundColor: '#072330',
  },
  header: {
    marginBottom: 10,
  },
  backArrow: {
    color: '#FFF',
    fontSize: 28,
    marginRight: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});