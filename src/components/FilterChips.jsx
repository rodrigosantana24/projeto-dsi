import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function FilterChips({ filters = [], onSelect }) {
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleSelect = (filter) => {
    setSelectedFilter(filter);
    if (onSelect) {
      onSelect(filter);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {filters.map((filter, index) => {
        const isSelected = selectedFilter === filter;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelect(filter)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.text, isSelected && styles.textSelected]}>
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  content: {
    marginTop: 10,
    paddingLeft: 0,
  },
  chip: {
    backgroundColor: '#915f23',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  chipSelected: {
    backgroundColor: '#f4a03f',
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
  textSelected: {
    fontWeight: 'bold',
  },
});
