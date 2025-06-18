import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomTab() {

  const route = useRoute();
  const navigation = useNavigation();

  const tabs = [
    { key: 'Home', label: 'Home', icon: 'home-outline' },
    { key: 'CineScreen', label: 'Cinemas', icon: 'location-outline' },
    { key: 'Menu', label: 'Menu', icon: 'menu-outline' },
  ];

  const handlePress = (tab) => {
          navigation.navigate(tab.key)
        }

  return (
    <View style={styles.bottomTab}>
      {tabs.map(tab => {
        const isSelected = route.name === tab.key;

        
        return (
          <View
            key={tab.key}
            style={[styles.tabContainer, isSelected && styles.selectedTabContainer]}
          >
            <TouchableOpacity
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => handlePress(tab)}
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
    backgroundColor: '#031b26',
    paddingVertical: 10,
    paddingTop: 5,
    borderTopColor: '#061d29',
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 15,
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