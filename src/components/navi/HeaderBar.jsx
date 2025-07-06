import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const HeaderBar = ({ title, onBack }) => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={{top:10, bottom:10, left:10, right:10}}>
            <Icon name="arrow-left" size={28} color="#EFEFEF" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      <View style={styles.right} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#072330',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  left: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: 40,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HeaderBar;