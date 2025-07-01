import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import AgendamentoService from '../services/AgendamentoService';
import AgendamentoForm from '../components/schedule/AgendamentoForm';

const ScheduleFormScreen = ({ route, navigation }) => {
  const agendamento = route.params?.agendamento || null;
  const isEdit = !!agendamento;
  const service = new AgendamentoService();
  const userId = agendamento?.userId || route.params?.userId;

  if (!userId) {
    Alert.alert('Erro', 'Usuário não identificado.');
    navigation.goBack();
    return null;
  }

  const [filmeSelecionado, setFilmeSelecionado] = useState(
    agendamento ? { id: '', title: agendamento.filmeId || '' } : { id: '', title: '' }
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
    if (!filmeSelecionado.title || !data || !hora) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regexData.test(data)) {
      Alert.alert('Erro', 'Data inválida! Use DD/MM/AAAA');
      return;
    }

    if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(hora)) {
      Alert.alert('Erro', 'Hora inválida! Use HH:mm');
      return;
    }

    const dataISO = formatarDataISO(data);

    try {
      if (isEdit) {
        await service.update({
          id: agendamento.id,           
          userId: agendamento.userId,
          filmeId: filmeSelecionado.title,  
          data: dataISO,
          hora,
        });
      } else {
        await service.create({
          userId,
          filmeId: filmeSelecionado.title,
          data: dataISO,
          hora,
        });
      }
      Alert.alert('Sucesso', 'Agendamento salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar agendamento.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
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

export default ScheduleFormScreen;
