import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import AgendamentoService from "../models/AgendamentoService";
import Filme from "../models/Filme";
import { UserContext } from "../Context/UserProvider";
import BottomTab from "../components/navi/BottomTab";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const PAGE_SIZE = 20;

export default function ToScheduleScreen() {
  const navigation = useNavigation();
  const { userCredentials } = useContext(UserContext);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [buscaFilme, setBuscaFilme] = useState('');
  const [filmesFiltrados, setFilmesFiltrados] = useState([]);
  const [filmesPagina, setFilmesPagina] = useState([]);
  const [buscandoFilmes, setBuscandoFilmes] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(0);

  const [novoFilme, setNovoFilme] = useState('');
  const [novaData, setNovaData] = useState('');
  const [novaHora, setNovaHora] = useState('');

  const service = new AgendamentoService();

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const dados = await service.read({ userId: userCredentials.uid });
      setAgendamentos(dados);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddAgendamento = async () => {
    if (!novoFilme || !novaData || !novaHora) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await service.create({
        userId: userCredentials.uid,
        filmeId: novoFilme,
        data: novaData,
        hora: novaHora,
      });
      setNovoFilme('');
      setNovaData('');
      setNovaHora('');
      setBuscaFilme('');
      setFilmesFiltrados([]);
      setFilmesPagina([]);
      setPaginaAtual(0);
      await carregarAgendamentos();
      Keyboard.dismiss();
    } catch (error) {
      console.error("Erro ao adicionar agendamento:", error);
    }
  };

  const handleUpdate = async (agendamento) => {
    try {
      const novoHorario = prompt('Digite a nova hora (HH:mm)', agendamento.hora);
      if (!novoHorario) return;
      await service.update({ ...agendamento, hora: novoHorario });
      await carregarAgendamentos();
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#c7defa" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Seus agendamentos</Text>
      </View>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do filme"
          placeholderTextColor="#a0b9d3"
          value={buscaFilme}
          onChangeText={setBuscaFilme}
        />
        <TouchableOpacity style={styles.button} onPress={buscarFilmes}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>

        {buscandoFilmes && <Text style={styles.buscandoTexto}>Buscando filmes...</Text>}

        {filmesPagina.length > 0 && (
          <FlatList
            data={filmesPagina}
            keyExtractor={(item) => item.id}
            style={styles.sugestoes}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.sugestaoItem}
                onPress={() => {
                  setNovoFilme(item.title);
                  setFilmesFiltrados([]);
                  setFilmesPagina([]);
                  setPaginaAtual(0);
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.sugestaoTexto}>{item.title}</Text>
              </TouchableOpacity>
            )}
            onEndReached={carregarMaisFilmes}
            onEndReachedThreshold={0.5}
          />
        )}

        <TextInput
          style={[styles.input, styles.inputDisabled]}
          placeholder="Filme selecionado"
          placeholderTextColor="#a0b9d3"
          value={novoFilme}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Data (YYYY-MM-DD)"
          placeholderTextColor="#a0b9d3"
          value={novaData}
          onChangeText={setNovaData}
        />
        <TextInput
          style={styles.input}
          placeholder="Hora (HH:mm)"
          placeholderTextColor="#a0b9d3"
          value={novaHora}
          onChangeText={setNovaHora}
        />
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddAgendamento}>
          <Text style={styles.buttonText}>Adicionar Agendamento</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Carregando agendamentos...</Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🎬 Filme: {item.filmeId}</Text>
              <Text style={styles.cardText}>📅 Data: {item.data}</Text>
              <Text style={styles.cardText}>⏰ Hora: {item.hora}</Text>
              
              <View style={styles.cardButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleUpdate(item)}>
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.delButton}>
                  <Text style={styles.editButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      )}

      <View style={styles.footer}>
        <BottomTab />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071923',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#c7defa',
  },
  formulario: {
    backgroundColor: '#142f43',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 5,
  },
  input: {
    backgroundColor: '#1f4e6a',
    color: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  buscandoTexto: {
    color: '#a0b9d3',
    fontStyle: 'italic',
    marginBottom: 12,
    marginLeft: 6,
  },
  sugestoes: {
    maxHeight: 160,
    backgroundColor: '#11314f',
    borderRadius: 10,
    marginVertical: 10,
  },
  sugestaoItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#1a73e8',
    borderBottomWidth: 1,
  },
  sugestaoTexto: {
    color: '#cce4f7',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1e2f47',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c7defa',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#a9c1e6',
    marginBottom: 6,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#0d264f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 6,
  },
  delButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 6,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  loadingText: {
    color: '#a0b9d3',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
