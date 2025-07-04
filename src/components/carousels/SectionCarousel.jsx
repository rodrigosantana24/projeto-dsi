import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MovieCard from '../cards/MovieCard';

export default function SectionCarousel({
  title,
  data,
  navigation,
  onViewAll,
  contentContainerStyle,
  generoId,
  generoLabel = ''
}) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onViewAll && data && data.length > 0 && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FilteringMovieScreen', {
                generoId: generoId,
                generoLabel: generoLabel,
              })
            }
          >
            <Text style={styles.viewAll}>Ver mais</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <MovieCard
            id={item.id}
            title={item.title}
            image={{ uri: item.getImageUrl() }}
            onPress={(id) => navigation.navigate('MovieDetailsScreen', { id })}
          />
        )}
        contentContainerStyle={contentContainerStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 14,
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
});
