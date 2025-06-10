import React from 'react';
import { View, ScrollView, Text, StyleSheet} from 'react-native';
import BottomTab from '../components/navi/BottomTab';
import { Logo } from '../components/logo/Logo';
import SearchBar from '../components/search/SearchBar';
import SectionCarousel from '../components/carousels/SectionCarousel';
import FeaturedCarousel from '../components/carousels/FeaturedCarousel';
import FilterChips from '../components/chips/FilterChips';

const filtros = ['Ação', 'Comédia', 'Terror', 'Romance', 'Suspense', 'Drama'];

const movieListTest = [
  { 
    title: 'Tropa de Elite 2',
    image: require('../assets/cards/teste6.webp'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Pecadores',
    image: require('../assets/cards/teste5.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Morbius',
    image: require('../assets/cards/teste2.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Velozes e Furiosos 10',
    image: require('../assets/cards/velozes_furiosos.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'The Beast Within',
    image: require('../assets/cards/teste1.png'),
    themeSession: 'Mais Assistidos',
  }
];

const movieListTest2 = [
  { 
    title: 'Titanic',
    image: require('../assets/cards/teste7.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Premonição 6',
    image: require('../assets/cards/teste8.webp'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Tropa de Elite 2',
    image: require('../assets/cards/teste6.webp'),
    themeSession: 'Mais Assistidos',
  }
];

const movieListTest3 = [
  { 
    title: 'O Retrato',
    image: require('../assets/cards/teste10.webp'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Harry Potter',
    image: require('../assets/cards/teste11.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Pantera Negra',
    image: require('../assets/cards/teste12.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'The Beast Within',
    image: require('../assets/cards/teste8.webp'),
    themeSession: 'Mais Assistidos',
  }
];

export default function HomeScreen( { navigation} ) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerBackVisible: false});
      }, [navigation]);

      const handleViewAll = (theme) => {
        console.log(`Ver todos os filmes em: ${theme}`);
      };
      
      return (
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.header}>
              <Text style={styles.headerText}>Encontre seu filme preferido!</Text>
              <Logo style={{ width: 75, height: 75 }}/>
            </View>
            <View style={styles.body}>
              <SearchBar />
              <FilterChips
                filters={filtros}
                onSelect={(filter) => console.log('Filtro selecionado:', filter)}
              />
              <FeaturedCarousel data={movieListTest3} />
              <SectionCarousel
                title="Ação e Aventura"
                data={movieListTest}
                onViewAll={() => handleViewAll('Ação e Aventura')}
                contentContainerStyle={{ paddingLeft: 0 }}
                />
              <SectionCarousel
              title="Drama e Suspense"
              data={movieListTest2}
              onViewAll={() => handleViewAll('Drama e Suspense')}
              contentContainerStyle={{ paddingLeft: 0 }}
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