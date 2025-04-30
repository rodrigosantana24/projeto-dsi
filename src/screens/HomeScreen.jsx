import React from 'react';
import { View, StyleSheet, FlatList} from 'react-native';
import MovieCard from '../components/MovieCard';
import BottomTab from '../components/BottomTab';

const movieListTest = [
  {
    title: 'Velozes e Furiosos 10',
    image: require('../assets/velozes_furiosos.jpg'),
    rating: 4.7,
  },
  {
    title: 'Velozes e Furiosos 10',
    image: require('../assets/velozes_furiosos.jpg'),
    rating: 4.7,
  },
  {
    title: 'Velozes e Furiosos 10',
    image: require('../assets/velozes_furiosos.jpg'),
    rating: 4.7,
  },
];

export default function HomeScreen( { navigation} ) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerBackVisible: false});
      }, [navigation]);
      
      return (
        <View style={styles.container}>
          <FlatList
            data={movieListTest}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <MovieCard title={item.title} image={item.image} rating={item.rating} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40 }}
          />
          <BottomTab />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192936'
  },
  content: {
    flex: 1,
    padding: 20,
  }
});