import React from "react";
import { View, Text } from "react-native";

export default function AddMovieScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Tela de Adicionar Filme</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>
        Esta é a tela onde você pode adicionar novos filmes à sua lista.
      </Text>
    </View>
  );
}