import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import BottomTab from '../components/navi/BottomTab';
import { Logo } from '../components/logo/Logo';
import SearchBar from '../components/search/SearchBar';
import SectionCarousel from '../components/carousels/SectionCarousel';
import FeaturedCarousel from '../components/carousels/FeaturedCarousel';
import FilterChips from '../components/chips/FilterChips';
import HomeController from '../controllers/HomeController';

export default function HomeScreen({ navigation }) {
  const [controller] = useState(new HomeController(navigation));
  const [carregando, setCarregando] = useState(true);
  const [acaoAventuraFilmes, setAcaoAventuraFilmes] = useState([]);
  const [dramaSuspenseFilmes, setDramaSuspenseFilmes] = useState([]);

  useLayoutEffect(() => {
    controller.configurarLayout();
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      await controller.carregarFilmes();
      // Busca filmes com primary_genre_id = 0 para "Ação e Aventura"
      const filmesAcaoAventura = await controller.getFilmesByPrimaryGenreIdLimited(0);
      setAcaoAventuraFilmes(filmesAcaoAventura);
      // Busca filmes com primary_genre_id = 6 para "Drama e Suspense"
      const filmesDramaSuspense = await controller.getFilmesByPrimaryGenreIdLimited(6);
      setDramaSuspenseFilmes(filmesDramaSuspense);
      setCarregando(false);
    };
    carregarDados();
  }, []);

  if (carregando) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }} // ajuste conforme a altura do BottomTab
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Encontre seu filme preferido!</Text>
          <Logo style={{ width: 75, height: 75 }} />
        </View>
        <View style={styles.body}>
          <SearchBar
            onSearch={(searchTerm) => {
              navigation.navigate('FilteringMovieScreen', { searchTerm, generoId: null, generoLabel: null });
            }}
          />
          <FilterChips
            filters={controller.getFiltros()}
            onSelect={(filter) => {
              navigation.navigate('FilteringMovieScreen', { generoId: filter.id, generoLabel: filter.label });
            }}
          />
          <FeaturedCarousel 
            data={controller.getFilmes()} 
            navigation={navigation}
          />
          <SectionCarousel
            title="Ação e Aventura"
            data={acaoAventuraFilmes}
            navigation={navigation}
            onViewAll={() => controller.verTodos('Ação e Aventura')}
            contentContainerStyle={{ paddingLeft: 0 }}
            keyExtractor={(item) => item.id}
            generoId={0}
            generoLabel="Ação e Aventura"
          />
          <SectionCarousel
            title="Drama e Suspense"
            data={dramaSuspenseFilmes}
            navigation={navigation}
            onViewAll={() => controller.verTodos('Drama e Suspense')}
            contentContainerStyle={{ paddingLeft: 0 }}
            keyExtractor={(item) => item.id}
            generoId={6}
            generoLabel="Drama e Suspense"
          />
        </View>
      </ScrollView>
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
    paddingTop: 25
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: -10,
    zIndex: 1,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -15,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});