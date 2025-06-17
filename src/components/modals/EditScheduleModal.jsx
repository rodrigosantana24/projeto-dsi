import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Filme from "../../models/Filme";

const PAGE_SIZE = 20;

export default function EditScheduleModal({
  visible,
  initialFilme = "",
  initialTime = "",
  initialData = "",
  onClose,
  onSave,
}) {
  const [buscaFilme, setBuscaFilme] = useState("");
  const [filmesFiltrados, setFilmesFiltrados] = useState([]);
  const [filmesPagina, setFilmesPagina] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [buscandoFilmes, setBuscandoFilmes] = useState(false);

  const [filmeSelecionado, setFilmeSelecionado] = useState(initialFilme);
  const [hora, setHora] = useState(initialTime);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (visible) {
      setBuscaFilme("");
      setFilmesFiltrados([]);
      setFilmesPagina([]);
      setPaginaAtual(0);
      setBuscandoFilmes(false);

      setFilmeSelecionado(initialFilme);
      setHora(initialTime);
      setData(initialData);
    }
  }, [visible, initialFilme, initialTime, initialData]);

  const buscarFilmes = async () => {
    if (!buscaFilme.trim()) {
      setFilmesFiltrados([]);
      setFilmesPagina([]);
      setPaginaAtual(0);
      return;
    }
    setBuscandoFilmes(true);
    try {
      const todos = await Filme.getFilmesFirebaseFiltrados(buscaFilme.trim());
      setFilmesFiltrados(todos);
      setFilmesPagina(todos.slice(0, PAGE_SIZE));
      setPaginaAtual(1);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setFilmesFiltrados([]);
      setFilmesPagina([]);
      setPaginaAtual(0);
    } finally {
      setBuscandoFilmes(false);
    }
  };

  const carregarMaisFilmes = () => {
    if (buscandoFilmes) return;
    const inicio = paginaAtual * PAGE_SIZE;
    const fim = inicio + PAGE_SIZE;
    const maisFilmes = filmesFiltrados.slice(inicio, fim);
    if (maisFilmes.length === 0) return;
    setFilmesPagina((prev) => [...prev, ...maisFilmes]);
    setPaginaAtual(paginaAtual + 1);
  };

  const selecionarFilme = (filme) => {
    setFilmeSelecionado(filme.title);
    setBuscaFilme("");
    setFilmesFiltrados([]);
    setFilmesPagina([]);
    setPaginaAtual(0);
    Keyboard.dismiss();
  };

  const salvar = () => {
    if (!filmeSelecionado || !data || !hora) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }
    onSave({ filmeId: filmeSelecionado, data, hora });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Editar Agendamento</Text>

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

          {buscandoFilmes && <ActivityIndicator color="#1a73e8" size="small" />}

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
            style={[styles.input, { backgroundColor: "#222" }]}
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

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.flexButton]}
              onPress={salvar}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, styles.flexButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(7, 25, 35, 0.85)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#142f43",
    borderRadius: 12,
    padding: 16,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#c7defa",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1f4e6a",
    color: "#e0e0e0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1a73e8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  flexButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  sugestoes: {
    maxHeight: 160,
    backgroundColor: "#11314f",
    borderRadius: 10,
    marginBottom: 12,
  },
  sugestaoItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: "#1a73e8",
    borderBottomWidth: 1,
  },
  sugestaoTexto: {
    color: "#cce4f7",
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
