import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
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

  useLayoutEffect(() => {
    controller.configurarLayout();
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      await controller.carregarFilmes();
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
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Encontre seu filme preferido!</Text>
          <Logo style={{ width: 75, height: 75 }} />
        </View>
        <View style={styles.body}>
          <SearchBar />
          <FilterChips
            filters={controller.getFiltros()}
            onSelect={(filter) => controller.aoSelecionarFiltro(filter)}
          />
          <FeaturedCarousel 
            data={controller.getFilmes()} 
            keyExtractor={(item) => item.id}
          />
          <SectionCarousel
            title="Ação e Aventura"
            data={controller.getFilmes()}
            onViewAll={() => controller.verTodos('Ação e Aventura')}
            contentContainerStyle={{ paddingLeft: 0 }}
            keyExtractor={(item) => item.id}
          />
          <SectionCarousel
            title="Drama e Suspense"
            data={controller.getFilmes()}
            onViewAll={() => controller.verTodos('Drama e Suspense')}
            contentContainerStyle={{ paddingLeft: 0 }}
            keyExtractor={(item) => item.id}
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
    backgroundColor: '#192936'
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
    paddingBottom: 70,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});