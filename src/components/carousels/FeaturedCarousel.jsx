import React, { useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import FeaturedCard from '../cards/FeaturedCard';

const { width } = Dimensions.get('window');

export default function FeaturedCarousel({ data, navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  const renderItem = ({ item }) => (
    <FeaturedCard
      title={item.title}
      imageUrl={item.getImageUrl()}
      onPress={() => navigation.navigate('MovieDetailsScreen', { id: item.id })}
    />
  );

  return (
    <View>
      <FlatList
        data={data}
        ref={flatListRef}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        decelerationRate="fast"
        snapToAlignment="center"
        snapToInterval={width}
      />
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
});