import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AgendamentoService from '../services/AgendamentoService';
import AgendamentoForm from '../components/schedule/AgendamentoForm';
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';

const ScheduleFormScreen = ({ route, navigation }) => {
  // agendamento agora tem filmeId no banco, mas Agendamento.fromFirebase hidrata em agendamento.filme
  const agendamento = route.params?.agendamento || null;
  const isEdit = !!agendamento;
  const service = new AgendamentoService();
  const userId = agendamento?.userId || route.params?.userId;

  if (!userId) {
    Toast.show({
      type: 'error',
      text1: 'Usuário não identificado',
      visibilityTime: 3000,
    });
    navigation.goBack();
    return null;
  }

  // Alteração: filmeSelecionado agora armazena id, title E poster_path,
  // pois isso será passado para o AgendamentoService.
  const [filmeSelecionado, setFilmeSelecionado] = useState(
    agendamento && agendamento.filme // Verifica se o objeto filme hidratado existe
      ? { 
          id: agendamento.filme.id, 
          title: agendamento.filme.title, 
          poster_path: agendamento.filme.poster_path 
        } // Pega ID, TÍTULO e POSTER_PATH do objeto hidratado
      : { id: '', title: '', poster_path: '' } // Inicializa com todos os campos vazios
  );

  const [data, setData] = useState(agendamento ? formatarData(agendamento.data) : '');
  const [hora, setHora] = useState(agendamento?.hora || '');

  function formatarData(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  function formatarDataISO(ddmmyyyy) {
    const [d, m, y] = ddmmyyyy.split('/');
    return `${y}-${m}-${d}`;
  }

  const salvar = async () => {
    // Alteração: Valida se todos os campos essenciais do filmeSelecionado estão preenchidos
    if (!filmeSelecionado.id || !filmeSelecionado.title || !filmeSelecionado.poster_path || !data || !hora) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos obrigatórios (Filme, Data, Hora).',
        visibilityTime: 3000,
      });
      return;
    }

    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regexData.test(data)) {
      Toast.show({
        type: 'error',
        text1: 'Data inválida! Use DD/MM/AAAA',
        visibilityTime: 3000,
      });
      setData('');
      return;
    }

    if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(hora)) {
      Toast.show({
        type: 'error',
        text1: 'Hora inválida! use HH:mm',
        visibilityTime: 3000,
      });
      setHora('');
      return;
    }

    const dataISO = formatarDataISO(data);

    const [day, month, year] = data.split('/').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Toast.show({
        type: 'error',
        text1: 'Não é possível agendar para uma data passada.',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      // Alteração: Passa o objeto filmeSelecionado COMPLETO para o serviço
      const agendamentoData = {
        userId,
        filme: filmeSelecionado, // Passa o objeto filme completo (id, title, poster_path)
        data: dataISO,
        hora,
      };

      if (isEdit) {
        await service.update({
          ...agendamentoData,
          id: agendamento.id,
        });
      } else {
        await service.create(agendamentoData);
      }
      Toast.show({
        type: 'success',
        text1: 'Agendamento feito com sucesso',
        visibilityTime: 3000,
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: `Erro ao salvar agendamento: ${error.message}`,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#c7defa" />
        </TouchableOpacity>
        <Text style={styles.titulo}>
          {isEdit ? "Editar Agendamento" : "Novo Agendamento"}
        </Text>
      </View>
      <AgendamentoForm
        filmeSelecionado={filmeSelecionado}
        onChangeFilmeSelecionado={setFilmeSelecionado}
        data={data}
        onChangeData={setData}
        hora={hora}
        onChangeHora={setHora}
        onSubmit={salvar}
        onCancel={() => navigation.goBack()}
        editando={isEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#072330",
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 5,
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
});

export default ScheduleFormScreen;