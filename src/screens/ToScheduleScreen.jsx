import React, { useState, useContext, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AgendamentoService from "../services/AgendamentoService";
import { UserContext } from "../Context/UserProvider";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SwipeListView } from 'react-native-swipe-list-view';
import AddButton from "../components/buttons/AddButton";
import Toast from "react-native-toast-message";
import CustomModal from "../components/modal/CustomModal";
import Icon from 'react-native-vector-icons/Feather';


import AgendamentoPressableItem from "../components/schedule/AgendamentoPressableItem";

export default function ToScheduleScreen() {
  const navigation = useNavigation();
  const { userCredentials } = useContext(UserContext);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("nenhum");
  const [valorFiltro, setValorFiltro] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agendamentoToDeleteId, setAgendamentoToDeleteId] = useState(null);
  const swipeRefs = useRef({});

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

  const handleConfirmDelete = (rowKey) => {
    setAgendamentoToDeleteId(rowKey);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setAgendamentoToDeleteId(null);
    if (swipeRefs.current[agendamentoToDeleteId]) {
      swipeRefs.current[agendamentoToDeleteId].closeRow();
    }
  };

  const handleExecuteDelete = async () => {
    if (agendamentoToDeleteId) {
      try {
        await service.delete({ userId: userCredentials.uid, id: agendamentoToDeleteId });
        Toast.show({
          type: 'success',
          text1: 'Agendamento excluído com sucesso!',
          visibilityTime: 3000,
        });
        setAgendamentos((prev) => prev.filter((item) => item.id !== agendamentoToDeleteId));
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Erro ao excluir agendamento',
          visibilityTime: 4000,
        });
      } finally {
        setShowDeleteModal(false);
        setAgendamentoToDeleteId(null);
        if (swipeRefs.current[agendamentoToDeleteId]) {
            swipeRefs.current[agendamentoToDeleteId].closeRow();
        }
      }
    }
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

  const formatarDataFiltro = (text) => {
    let cleanedText = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleanedText.length > 0) {
      formattedText = cleanedText.substring(0, 2);
      if (cleanedText.length >= 3) {
        formattedText += '/' + cleanedText.substring(2, 4);
      }
      if (cleanedText.length >= 5) {
        formattedText += '/' + cleanedText.substring(4, 8);
      }
    }
    setValorFiltro(formattedText);
  };

  const formatarHoraFiltro = (text) => {
    let cleanedText = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleanedText.length > 0) {
      formattedText = cleanedText.substring(0, 2);
      if (cleanedText.length >= 3) {
        formattedText += ':' + cleanedText.substring(2, 4);
      }
    }
    setValorFiltro(formattedText);
  };

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
      return agendamentos.filter((item) => item.data === filtroISO);
    }

    if (filtro === "hora") {
      const horaFiltro = valorFiltro.trim();
      if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(horaFiltro)) {
        return [];
      }
      return agendamentos.filter(item => item.hora === horaFiltro);
    }

    return agendamentos;
  }

  const agendamentosFiltrados = filtrarAgendamentos();

  useFocusEffect(
    useCallback(() => {
      carregarAgendamentos();
      return () => {
        setShowDeleteModal(false);
        setAgendamentoToDeleteId(null);
        Object.values(swipeRefs.current).forEach(rowRef => {
            if (rowRef && typeof rowRef.closeRow === 'function') {
                rowRef.closeRow();
            }
        });
      };
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
            placeholder={filtro === "data" ? "DD/MM/AAAA" : "HH:mm"}
            placeholderTextColor={'#999'}
            value={valorFiltro}
            onChangeText={filtro === "data" ? formatarDataFiltro : formatarHoraFiltro}
            maxLength={filtro === "data" ? 10 : 5}
            keyboardType="numeric"
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
            <AgendamentoPressableItem item={item} swipeRefs={swipeRefs} />
          )}
          renderHiddenItem={({ item, rowMap }) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => handleConfirmDelete(item.id)}
              >
                <Icon name="trash-2" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-75}
          disableRightSwipe
          contentContainerStyle={{ paddingBottom: 60 }}
          onRowOpen={(rowKey, rowMap) => {
            swipeRefs.current[rowKey] = rowMap[rowKey];
            handleConfirmDelete(rowKey);
          }}
          onRowClose={(rowKey) => {
            if (swipeRefs.current[rowKey]) {
                delete swipeRefs.current[rowKey];
            }
          }}
          closeOnRowPress={true}
        />
      )}
      <AddButton onPress={() => navigation.navigate("ScheduleFormScreen", {userId: userCredentials.uid})}></AddButton>

      <CustomModal
        visible={showDeleteModal}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita."
        onCancel={handleCancelDelete}
        onConfirm={handleExecuteDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="#dc3545"
        cancelColor="#f4a03f"
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#D9534F',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 20,
    marginBottom: 12,
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#D9534F',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  backRightBtnRight: {
    backgroundColor: '#D9534F',
    right: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
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
    backgroundColor: '#072330',
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
});