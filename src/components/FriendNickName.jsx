import React, { useEffect, useState } from 'react';
import { Text , View } from 'react-native'; // IMPORTANTE!
import getNickName from '../services/getNickName';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { StyleSheet } from 'react-native'; // IMPORTANTE!
export default function FriendNickName({ userId, amigoId, style }) {
  const [nick, setNick] = useState('');

  useEffect(() => {
    let isMounted = true;
    getNickName({ userId, amigoId }).then((result) => {
      if (isMounted) setNick(result || '');
    });
    return () => { isMounted = false; };
  }, [userId, amigoId]);

return (
    <View>
      <View style={styles.titleContainer}>
        <MaterialIcons name="edit" size={16} color="white" />
        <Text style={styles.titleText}>Apelido :</Text>
      </View>
      <Text style={style}>{nick}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  titleText: {
    fontWeight: 'bold', 
    color: 'white', 
    fontSize: 16,
    marginLeft: 5 // Espaço entre o ícone e o texto
  }
});