import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import AgendamentoService from "../services/AgendamentoService";
import Filme from "../models/Filme";
import { UserContext } from "../Context/UserProvider";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import EditScheduleModal from "../components/modals/EditScheduleModal";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtro, setFiltro] = useState("nenhum"); 
  const [valorFiltro, setValorFiltro] = useState('');

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

  function abrirModalEdicao(agendamento) {
    setAgendamentoEditando(agendamento);
    setModalVisible(true);
  }

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

  async function salvarEdicao({ filmeId, data, hora }) {
  try {
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = data.match(regexData);
    if (!match) {
      alert("Data inválida! Use o formato DD/MM/YYYY");
      return;
    }
    const [_, diaStr, mesStr, anoStr] = match;
    const dia = parseInt(diaStr, 10);
    const mes = parseInt(mesStr, 10);
    const ano = parseInt(anoStr, 10);
    const dataObj = new Date(ano, mes - 1, dia);
    if (
      dataObj.getDate() !== dia ||
      dataObj.getMonth() !== mes - 1 ||
      dataObj.getFullYear() !== ano
    ) {
      alert("Data inválida! Essa data não existe.");
      return;
    }
    const dataISO = `${ano}-${mesStr.padStart(2, "0")}-${diaStr.padStart(2, "0")}`;
    if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(hora)) {
      alert("Hora inválida! Use o formato HH:mm");
      return;
    }
    await service.update({
      id: agendamentoEditando.id,
      userId: agendamentoEditando.userId,
      filmeId,
      data: dataISO,
      hora,
    });
    setModalVisible(false);
    setAgendamentoEditando(null);
    await carregarAgendamentos();
  } catch (error) {
    console.error(error);
  }
}

  async function excluirAgendamento(id) {
    try {
      await service.delete({ userId: userCredentials.uid, id });
      Alert.alert("Agendamento excluído");
      setAgendamentos((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  const carregarMaisFilmes = () => {
    if (buscandoFilmes) return;
    const inicio = paginaAtual * PAGE_SIZE;
    const fim = inicio + PAGE_SIZE;
    const maisFilmes = filmesFiltrados.slice(inicio, fim);
    if (maisFilmes.length === 0) return;
    setFilmesPagina((prev) => [...prev, ...maisFilmes]);
    setPaginaAtual(paginaAtual + 1);
  };

  function converterDataParaISO(dataBR) {
    const partes = dataBR.split("/");
    if (partes.length !== 3) return null;
    const [dia, mes, ano] = partes;
    if (
      dia.length !== 2 ||
      mes.length !== 2 ||
      ano.length !== 4 ||
      isNaN(Date.parse(`${ano}-${mes}-${dia}`))
    )
      return null;
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }

  function formatarData(dataISO) {
    if (!dataISO) return "";
    const partes = dataISO.split("-");
    if (partes.length !== 3) return dataISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function filtrarAgendamentos() {
  if (filtro === "nenhum" || !valorFiltro.trim()) return agendamentos;

  if (filtro === "data") {
    const dataBR = valorFiltro.trim();
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    if (!regex.test(dataBR)) {
      return [];
    }
    const [dia, mes, ano] = dataBR.split("/").map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    if (
      dataObj.getDate() !== dia ||
      dataObj.getMonth() !== mes - 1 ||
      dataObj.getFullYear() !== ano
    ) {
      return [];
    }

    const filtroISO = converterDataParaISO(dataBR);
    return agendamentos.filter((item) => item.data >= filtroISO);
  }

  if (filtro === "hora") {
    const horaFiltro = valorFiltro.trim();
    if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(horaFiltro)) {
      return []; 
    }
    return agendamentos.filter(item => {return item.hora >= horaFiltro;});    
  }

  return agendamentos;
}


  const agendamentosFiltrados = filtrarAgendamentos();

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  }

  const handleAddAgendamento = async () => {
  if (!novoFilme || !novaData || !novaHora) {
    alert("Preencha todos os campos");
    return;
  }

  const partesData = novaData.split("/");
  if (partesData.length !== 3) {
    alert("Data inválida! Use o formato DD/MM/YYYY");
    return;
  }

  const [dia, mes, ano] = partesData;
  const dataInformada = new Date(`${ano}-${mes}-${dia}T00:00:00`);
  if (isNaN(dataInformada)) {
    alert("Data inválida! Use o formato DD/MM/YYYY");
    return;
  }

  const dataAtual = new Date();
  dataAtual.setHours(0, 0, 0, 0);

  if (dataInformada < dataAtual) {
    alert("Data inválida! A data deve ser hoje ou uma data futura.");
    return;
  }

  
  if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(novaHora)) {
    alert("Hora inválida! Use o formato HH:mm");
    return;
  }

  try {
    const dataISO = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    await service.create({
      userId: userCredentials.uid,
      filmeId: novoFilme,
      data: dataISO,
      hora: novaHora,
    });
    setNovoFilme("");
    setNovaData("");
    setNovaHora("");
    setBuscaFilme("");
    setFilmesFiltrados([]);
    setFilmesPagina([]);
    setPaginaAtual(0);
    await carregarAgendamentos();
    Keyboard.dismiss();
  } catch (error) {
    console.error("Erro ao adicionar agendamento:", error);
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

    <View style={styles.filtroContainer}>
      <Text style={styles.labelFiltro}>Filtrar por:</Text>
      <View style={styles.filtroOpcoes}>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === "nenhum" && styles.filtroBotaoSelecionado]}
          onPress={() => {
            setFiltro("nenhum");
            setValorFiltro("");
          }}
        >
          <Text style={styles.textoFiltro}>Nenhum</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === "data" && styles.filtroBotaoSelecionado]}
          onPress={() => {
            setFiltro("data");
            setValorFiltro("");
          }}
        >
          <Text style={styles.textoFiltro}>Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBotao, filtro === "hora" && styles.filtroBotaoSelecionado]}
          onPress={() => {
            setFiltro("hora");
            setValorFiltro("");
          }}
        >
          <Text style={styles.textoFiltro}>Hora</Text>
        </TouchableOpacity>
      </View>
      {filtro !== "nenhum" && (
        <TextInput
          style={styles.inputFiltro}
          placeholder={filtro === "data" ? "Digite a data (DD/MM/YYYY)" : "Digite a hora (HH:mm)"}
          placeholderTextColor={'#999'}
          value={valorFiltro}
          onChangeText={setValorFiltro}
        />
      )}
    </View>

    <TouchableOpacity style={styles.button} onPress={toggleFormulario}>
      <Text style={styles.buttonText}>{mostrarFormulario ? 'Fechar Formulário' : 'Mostrar Formulário'}</Text>
    </TouchableOpacity>
    {mostrarFormulario && (
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
        placeholder="Data (DD/MM/YYYY)"
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
    )}
    

    {loading ? (
      <Text style={styles.loadingText}>Carregando agendamentos...</Text>
    ) : (
      <FlatList
        data={agendamentosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎬 Filme: {item.filmeId}</Text>
            <Text style={styles.cardText}>📅 Data: {formatarData(item.data)}</Text>
            <Text style={styles.cardText}>⏰ Hora: {item.hora}</Text>

            <View style={styles.cardButtons}>
              <TouchableOpacity style={styles.editButton} onPress={() => abrirModalEdicao(item)}>
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delButton} onPress={() => excluirAgendamento(item.id)}>
                <Text style={styles.editButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    )}


    <EditScheduleModal
      visible={modalVisible}
      initialFilme={agendamentoEditando ? agendamentoEditando.filmeId : ""}
      initialTime={agendamentoEditando ? agendamentoEditando.hora : ""}
      onClose={() => setModalVisible(false)}
      onSave={salvarEdicao}
    />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#072330",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  formulario: {
    backgroundColor: "#142f43",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 5,
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
  inputDisabled: {
    opacity: 0.7,
  },
  button: {
    backgroundColor: "#f4a03f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  buscandoTexto: {
    color: "#a0b9d3",
    fontStyle: "italic",
    marginBottom: 12,
    marginLeft: 6,
  },
  sugestoes: {
    maxHeight: 160,
    backgroundColor: "#11314f",
    borderRadius: 10,
    marginVertical: 10,
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
  card: {
    backgroundColor: "#1e2f47",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#1f4e6a",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 6,
  },
  delButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 6,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  loadingText: {
    color: "#a0b9d3",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  filtroContainer: {
    marginBottom: 20,
    backgroundColor: "#142f43",
    padding: 12,
    borderRadius: 10,
  },
  labelFiltro: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 16,
  },
  filtroOpcoes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  filtroBotao: {
    backgroundColor: "#1f4e6a",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  filtroBotaoSelecionado: {
    backgroundColor: "#1a73e8",
  },
  textoFiltro: {
    color: "#c7defa",
    fontWeight: "700",
  },
  inputFiltro: {
    backgroundColor: "#1f4e6a",
    color: "#e0e0e0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
  },
});