import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  Pressable,
  Animated
} from "react-native";
import AgendamentoService from "../services/AgendamentoService";
import { UserContext } from "../Context/UserProvider";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {  MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import AddButton from "../components/buttons/AddButton";
import Toast from "react-native-toast-message";

export default function ToScheduleScreen() {
  const navigation = useNavigation();
  const { userCredentials } = useContext(UserContext);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [novoFilme, setNovoFilme] = useState('');
  const [novaData, setNovaData] = useState('');
  const [novaHora, setNovaHora] = useState('');
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

  async function excluirAgendamento(id) {
    try {
      await service.delete({ userId: userCredentials.uid, id });
      Toast.show({
        type: 'success',
        text1: 'Agendamento excluído com sucesso!',
        visibilityTime: 3000,
      });
      setAgendamentos((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao excluir agendamento',
        visibilityTime: 4000,
      });
    }
  }


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

  const handleAddAgendamento = async () => {
  if (!novoFilme || !novaData || !novaHora) {
    alert("Preencha todos os campos");
    Toast.show({
      type: 'success',
      text1: 'Preencha todos os campos',
      visibilityTime: 3000,
    })
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

  useFocusEffect(
    useCallback(() => {
    carregarAgendamentos();
    }, [userCredentials.uid])
  );

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


    {loading ? (
      <Text style={styles.loadingText}>Carregando agendamentos...</Text>
    ) : (
      
  <SwipeListView
    data={agendamentosFiltrados}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate("ScheduleFormScreen", {agendamento: item})} style={({ pressed }) => [
        styles.card, { transform: [{ scale: pressed ? 1.02 : 1 }] },
    ]}>
          <Text style={styles.cardTitle}>🎬 Filme: {typeof item.filmeId === 'object' ? item.filmeId.title : item.filmeId}</Text>
          <Text style={styles.cardText}>📅 Data: {formatarData(item.data)}</Text>
          <Text style={styles.cardText}>⏰ Hora: {item.hora}</Text>
        </Pressable>
    )}
    renderHiddenItem={({ item }) => (
      <View style={styles.hiddenContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => excluirAgendamento(item.id)}
        >
          <MaterialIcons name="delete" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    )}
    rightOpenValue={-75}
    disableRightSwipe
    swipeToOpenPercent={100}
    contentContainerStyle={{ paddingBottom: 60 }}
    />
  )}
    <AddButton onPress={() => navigation.navigate("ScheduleFormScreen", {userId: userCredentials.uid})}></AddButton>
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
    backgroundColor: "#f4a03f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#113342",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
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
  cardButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#f4a03f",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 6,
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
  filtroContainer: {
    marginBottom: 20,
    backgroundColor: "#113342",
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
    backgroundColor: "#f4a03f",
  },
  textoFiltro: {
    color: "#fff",
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
  hiddenContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,    
  },
  deleteButton: {
    backgroundColor: '#c00',
    width: 75,
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  pressed: {

  }
});