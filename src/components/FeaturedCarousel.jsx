import React, { useRef, useState } from 'react';
import { View, Text, ImageBackground, FlatList, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Carousel = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  const renderItem = ({ item }) => (
    <ImageBackground
      source={item.image}
      style={styles.card}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </ImageBackground>
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
    card: {
        width: width,
        height: 220,
        justifyContent: 'flex-end',
        padding: 10,
        marginTop: 20,
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        padding: 20,
    },
    title: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
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

export default Carousel;