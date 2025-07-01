import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import MovieCard from '../cards/MovieCard';

export default function FilteringSectionCarousel({
  title,
  data,
  navigation,
  onViewAll,
  contentContainerStyle
}) {
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleEndReached = () => {
    if (visibleCount < data.length) {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, data.length));
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.carouselBackground}>
        <FlatList
          data={data.slice(0, visibleCount)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <MovieCard
                id={item.id}
                title={item.title || " "}
                image={{ uri: item.imagem || (item.getImageUrl && item.getImageUrl()) }}
                onPress={(id) => navigation.navigate('MovieDetailsScreen', { id })}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.movieName}>{item.title || "0" }</Text>
                {item.release_date && (
                  <Text style={styles.movieInfo}>Lançamento: {item.release_date  || "0" }</Text>
                )}
                {item.runtime && (
                  <Text style={styles.movieInfo}>Duração: {item.runtime  || "0" } min</Text>
                )}
                {item.vote_average && (
                  <Text style={styles.movieInfo}>Nota: {item.vote_average  || "0" }</Text>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={contentContainerStyle}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 5,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#f4a03f',
    fontSize: 14,
  },
  carouselBackground: {
    borderRadius: 12,
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: 6,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  movieName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  movieInfo: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 1,
  },
});