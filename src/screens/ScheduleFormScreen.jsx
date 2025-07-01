import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Filme from "../models/Filme";
import AgendamentoService from "../services/AgendamentoService";

const PAGE_SIZE = 20;

export default function ScheduleFormScreen({ route, navigation }) {
  const agendamento = route.params?.agendamento || null;
  const isEdit = !!agendamento;
  const [buscaFilme, setBuscaFilme] = useState("");
  const [filmesFiltrados, setFilmesFiltrados] = useState([]);
  const [filmesPagina, setFilmesPagina] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [buscandoFilmes, setBuscandoFilmes] = useState(false);

  const userId = agendamento?.userId || route.params?.userId || null;
  const service = new AgendamentoService();

  if (!userId) {
    alert("Usuário não identificado.");
    return null;
  }

  const [filmeSelecionado, setFilmeSelecionado] = useState(
    agendamento ? agendamento.filmeId : ""
  );

  const [data, setData] = useState(
    agendamento ? formatarData(agendamento.data) : ""
  );

  const [hora, setHora] = useState(agendamento?.hora || "");

  useEffect(() => {
    setBuscaFilme("");
    setFilmesFiltrados([]);
    setFilmesPagina([]);
    setPaginaAtual(0);
    setBuscandoFilmes(false);
  }, []);

  const buscarFilmes = async () => {
    if (!buscaFilme.trim()) return;
    setBuscandoFilmes(true);
    try {
      const todos = await Filme.getFilmesFirebaseFiltrados(buscaFilme.trim());
      setFilmesFiltrados(todos);
      setFilmesPagina(todos.slice(0, PAGE_SIZE));
      setPaginaAtual(1);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setBuscandoFilmes(false);
    }
  };

  const carregarMaisFilmes = () => {
    if (buscandoFilmes) return;
    const inicio = paginaAtual * PAGE_SIZE;
    const fim = inicio + PAGE_SIZE;
    const mais = filmesFiltrados.slice(inicio, fim);
    if (mais.length === 0) return;
    setFilmesPagina((prev) => [...prev, ...mais]);
    setPaginaAtual(paginaAtual + 1);
  };

  const selecionarFilme = (filme) => {
    setFilmeSelecionado(filme.title);
    setBuscaFilme("");
    setFilmesFiltrados([]);
    setFilmesPagina([]);
    Keyboard.dismiss();
  };

  const salvar = async () => {
    if (!filmeSelecionado || !data || !hora) {
      alert("Preencha todos os campos");
      return;
    }

    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = data.match(regexData);
    if (!match) {
      alert("Data inválida! Use DD/MM/AAAA");
      return;
    }

    const [_, diaStr, mesStr, anoStr] = match;
    const dia = parseInt(diaStr, 10);
    const mes = parseInt(mesStr, 10);
    const ano = parseInt(anoStr, 10);
    const dataObj = new Date(ano, mes - 1, dia);
    const dataISO = `${ano}-${mesStr.padStart(2, "0")}-${diaStr.padStart(2, "0")}`;

    if (
      dataObj.getDate() !== dia ||
      dataObj.getMonth() !== mes - 1 ||
      dataObj.getFullYear() !== ano
    ) {
      alert("Data inválida! Essa data não existe.");
      return;
    }

    if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(hora)) {
      alert("Hora inválida! Use HH:mm");
      return;
    }

    try {
      if (isEdit) {
        await service.update({
          id: agendamento.id,
          userId: agendamento.userId,
          filmeId: filmeSelecionado,
          data: dataISO,
          hora,
        });
      } else {
        await service.create({
          userId,
          filmeId: filmeSelecionado,
          data: dataISO,
          hora,
        });
      }

      alert("Agendamento salvo com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert("Erro ao salvar agendamento.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? "Editar Agendamento" : "Novo Agendamento"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar filme..."
        placeholderTextColor="#a0b9d3"
        value={buscaFilme}
        onChangeText={setBuscaFilme}
      />
      <TouchableOpacity style={styles.button} onPress={buscarFilmes}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {buscandoFilmes && <ActivityIndicator color="#1a73e8" />}

      {filmesPagina.length > 0 && (
        <FlatList
          style={styles.sugestoes}
          data={filmesPagina}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sugestaoItem}
              onPress={() => selecionarFilme(item)}
            >
              <Text style={styles.sugestaoTexto}>{item.title}</Text>
            </TouchableOpacity>
          )}
          onEndReached={carregarMaisFilmes}
          onEndReachedThreshold={0.5}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Filme selecionado"
        placeholderTextColor="#a0b9d3"
        value={filmeSelecionado}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Data (DD/MM/AAAA)"
        placeholderTextColor="#a0b9d3"
        value={data}
        onChangeText={setData}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora (HH:mm)"
        placeholderTextColor="#a0b9d3"
        value={hora}
        onChangeText={setHora}
      />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>
          {isEdit ? "Atualizar Agendamento" : "Salvar Agendamento"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function formatarData(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#072330",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#c7defa",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1f4e6a",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1a73e8",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sugestoes: {
    maxHeight: 160,
    backgroundColor: "#11314f",
    borderRadius: 10,
    marginBottom: 12,
  },
  sugestaoItem: {
    padding: 12,
    borderBottomColor: "#1a73e8",
    borderBottomWidth: 1,
  },
  sugestaoTexto: {
    color: "#cce4f7",
  },
});
