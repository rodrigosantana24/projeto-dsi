import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ProfileButton = ({ icon, text, onPress, showArrow = true }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      {icon}
      <Text style={styles.menuText}>{text}</Text>
      {showArrow && (
        <Feather
          name="chevron-right"
          size={20}
          color="white"
          style={{ marginLeft: 'auto' }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#2f3e4f',
    borderBottomWidth: 1,
    backgroundColor: '#16222f',
    borderRadius: 8,
    marginBottom: 10,
  },
  menuText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileButton;