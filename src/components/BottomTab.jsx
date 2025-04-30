import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

export default function BottomTab() {
  return (
    <View style={styles.bottomTab}>
      <TouchableOpacity style={styles.tabItem}>
        <Image source={require('../assets/favicon.png')} style={styles.tabIcon} />
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Image source={require('../assets/favicon.png')} style={styles.tabIcon} />
        <Text style={styles.tabText}>Em cartaz</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Image source={require('../assets/favicon.png')} style={styles.tabIcon} />
        <Text style={styles.tabText}>Cinemas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Image source={require('../assets/favicon.png')} style={styles.tabIcon} />
        <Text style={styles.tabText}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1C1F2E',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tabItem: { alignItems: 'center' },
  tabIcon: { width: 24, height: 24, marginBottom: 4 },
  tabText: { color: 'white', fontSize: 12 },
  placeholderTabItem: { width: 50, height: 40 },
});