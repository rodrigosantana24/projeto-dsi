import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MovieCard from './MovieCard';

export default function SectionCarousel({
  title,
  data,
  onViewAll,
  contentContainerStyle,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
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
            title={item.title}
            image={item.image}
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
