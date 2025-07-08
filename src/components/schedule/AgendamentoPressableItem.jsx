import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 


const formatarData = (dataISO) => {
  if (!dataISO) return "";
  const partes = dataISO.split("-");
  if (partes.length !== 3) return dataISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

function AgendamentoPressableItem({ item, swipeRefs }) {
  const navigation = useNavigation(); 

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
      <Text style={itemStyles.cardTitle}>🎬 Filme: {typeof item.filmeId === 'object' ? item.filmeId.title : item.filmeId}</Text>
      <Text style={itemStyles.cardText}>📅 Data: {formatarData(item.data)}</Text>
      <Text style={itemStyles.cardText}>⏰ Hora: {item.hora}</Text>
    </Pressable>
  );
}

const itemStyles = StyleSheet.create({
  rowFront: {
    backgroundColor: "#113342",
    borderRadius: 2,
    marginBottom: 12,
    padding: 16,
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