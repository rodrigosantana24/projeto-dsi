import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const HeaderBar = ({ title, onBack, rightComponent }) => {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-left" size={28} color="#EFEFEF" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {rightComponent && <View style={styles.right}>{rightComponent}</View>}
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
    justifyContent: 'space-between',
  },
  backButton: {
    paddingRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  right: {
    paddingLeft: 10,
  },
});

export default HeaderBar;
