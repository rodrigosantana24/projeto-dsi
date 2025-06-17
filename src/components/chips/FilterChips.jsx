import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function FilterChips({ filters = [], onSelect }) {
  const [selectedFilter, setSelectedFilter] = useState(filters[0]?.id ?? null);

  const handleSelect = (filter) => {
    setSelectedFilter(filter.id);
    if (onSelect) {
      onSelect(filter);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter) => {
          const isSelected = selectedFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id ?? filter.label}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => handleSelect(filter)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#f4a03f',
  },
  chipSelected: {
    backgroundColor: '#f4a03f',
    borderColor: '#f4a03f',
  },
  chipText: {
    color: '#072330',
    fontWeight: 'bold',
    fontSize: 15,
  },
  chipTextSelected: {
    color: '#FFF',
  },
});
