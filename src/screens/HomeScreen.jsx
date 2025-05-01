import React from 'react';
import { View, Text, StyleSheet, FlatList} from 'react-native';
import BottomTab from '../components/BottomTab';
import { Logo } from '../components/Logo';
import SearchBar from '../components/SearchBar';
import SectionCarousel from '../components/SectionCarousel';
import FeaturedCarousel from '../components/FeaturedCarousel';

const movieListTest = [
  { 
    title: 'Velozes e Furiosos 10',
    image: require('../assets/velozes_furiosos.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Velozes e Furiosos 10',
    image: require('../assets/velozes_furiosos.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Velozes e Furiosos 10',
    image: require('../assets/velozes_furiosos.jpg'),
    themeSession: 'Mais Assistidos',
  },
  { 
    title: 'Velozes e Furiosos 10',
    image: require('../assets/velozes_furiosos.jpg'),
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
          <View style={styles.header}>
            <Text style={styles.headerText}>Encontre seu filme preferido!</Text>
            <Logo style={{ width: 75, height: 75 }}/>
          </View>
          <View style={styles.body}>
            <SearchBar />
            <FeaturedCarousel data={movieListTest} />
            <SectionCarousel
              title="Ação e Aventura"
              data={movieListTest}
              onViewAll={() => handleViewAll('Ação e Aventura')}
              contentContainerStyle={{ paddingLeft: 20 }} style={styles.section}
              />
          </View>
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