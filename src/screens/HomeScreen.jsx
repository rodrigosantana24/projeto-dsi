import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, Button , TouchableOpacity } from 'react-native';
import BottomTab from '../components/navi/BottomTab';
import { Logo } from '../components/logo/Logo';
import SearchBar from '../components/search/SearchBar';
import SectionCarousel from '../components/carousels/SectionCarousel';
import FeaturedCarousel from '../components/carousels/FeaturedCarousel';
import HomeController from '../controllers/HomeController';
import { StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [controller] = useState(new HomeController(navigation));
  const [carregando, setCarregando] = useState(true);
  const [acaoAventuraFilmes, setAcaoAventuraFilmes] = useState([]);
  const [dramaSuspenseFilmes, setDramaSuspenseFilmes] = useState([]);
  const [terrorFilmes, setFilmesterrorFilmes] = useState([]);
  NavigationBar.setVisibilityAsync('hidden');

  useLayoutEffect(() => {
    controller.configurarLayout();
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      await controller.carregarFilmes();
      const filmesAcaoAventura = await controller.getFilmesByPrimaryGenreId(genreId = 0, limit = 10);
      setAcaoAventuraFilmes(filmesAcaoAventura);
      const filmesDramaSuspense = await controller.getFilmesByPrimaryGenreId(genreId = 6, limit = 10);
      setDramaSuspenseFilmes(filmesDramaSuspense);
      const terrorFilmes = await controller.getFilmesByPrimaryGenreId(genreId = 10, limit = 10);
      setFilmesterrorFilmes(terrorFilmes);
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
      <StatusBar hidden={true} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Encontre seu filme preferido!</Text>
          <Logo style={{ width: 75, height: 75 }} />
        </View>
        <View style={styles.body}>
          <TouchableOpacity style={styles.search} onPress={() => navigation.navigate('FilteringMovieScreen')} activeOpacity={1}>
            <SearchBar style={{ pointerEvents: 'none' }} />
          </TouchableOpacity>
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
          <SectionCarousel
            title="Terror"
            data={terrorFilmes}
            navigation={navigation}
            onViewAll={() => controller.verTodos('Terror')}
            contentContainerStyle={{ paddingLeft: 0 }}
            keyExtractor={(item) => item.id}
            generoId={10}
            generoLabel="Terror"
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
    paddingTop: 30
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
    marginBottom: -5,
    zIndex: 1,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -15,
  },
  search: {
    marginVertical: 4
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