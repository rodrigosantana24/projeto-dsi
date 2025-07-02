import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
export default function AddButton({ onPress }) {
  return (
   <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
    >
      <MaterialIcons name="add" size={32} color="#fff" />
    </TouchableOpacity>    
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#f4a03f',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
});