import React from 'react';
import { Pressable, Text, StyleSheet, Image, View } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';
import Filme from '../../models/Filme'; 

const formatarData = (dataISO) => {
  if (!dataISO) return "";
  const partes = dataISO.split("-");
  if (partes.length !== 3) return dataISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

function AgendamentoPressableItem({ item, swipeRefs }) {
  const navigation = useNavigation();

  const filmeTitle = item.filme?.title || 'Filme Desconhecido';
  const filmePosterPath = item.filme?.poster_path || null;
  
  const imageUrl = filmePosterPath ? new Filme(null, null, filmePosterPath).getImageUrl() : null;

  return (
    <Pressable
      style={({ pressed }) => [
        itemStyles.rowFront,
        { transform: [{ scale: pressed ? 1.02 : 1 }] }
      ]}
      onPress={() => {
        if (swipeRefs && swipeRefs.current[item.id]) {
          swipeRefs.current[item.id].closeRow();
        }
        navigation.navigate("ScheduleFormScreen", { agendamento: item });
      }}
    >
      <View style={itemStyles.contentContainer}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={itemStyles.posterImage}
            resizeMode="cover"
          />
        )}
        <View style={itemStyles.textContainer}>
          <Text style={itemStyles.cardTitle}>🎬 Filme: {filmeTitle}</Text>
          <Text style={itemStyles.cardText}>📅 Data: {formatarData(item.data)}</Text>
          <Text style={itemStyles.cardText}>⏰ Hora: {item.hora}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const itemStyles = StyleSheet.create({
  rowFront: {
    backgroundColor: "#113342",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
  },
  posterImage: {
    width: 60, 
    height: 90, 
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#072330', 
  },
  textContainer: {
    flex: 1, 
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
});

export default AgendamentoPressableItem;