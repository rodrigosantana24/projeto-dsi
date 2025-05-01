import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BottomTab() {

  const [selected, setSelected] = useState('Home');

  const tabs = [
    { key: 'Home', label: 'Home', icon: 'home-outline' },
    { key: 'Cartaz', label: 'Em cartaz', icon: 'film-outline' },
    { key: 'Cinemas', label: 'Cinemas', icon: 'location-outline' },
    { key: 'Menu', label: 'Menu', icon: 'menu-outline' },
  ];

  return (
    <View style={styles.bottomTab}>
      {tabs.map(tab => {
        const isSelected = selected === tab.key;
        return (
          <View
            key={tab.key}
            style={[styles.tabContainer, isSelected && styles.selectedTabContainer]}
          >
            <TouchableOpacity
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => setSelected(tab.key)}
            >
              <Icon
                name={tab.icon}
                size={24}
                color={isSelected ? '#fff' : '#999'}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  isSelected && styles.selectedText
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#072330',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#061d29',
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  selectedTabContainer: {
    backgroundColor: '#113342',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabText: {
    color: '#999',
    fontSize: 12,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});