import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AtorService from '../services/AtorService';
import AtorForm from '../components/actors/AtorForm';
import HeaderBar from '../components/navi/HeaderBar';
import Toast from 'react-native-toast-message';

const atorService = new AtorService();

export default class ActorFormScreen extends React.Component {
  constructor(props) {
    super(props);
    const ator = props.route?.params?.ator;
    this.state = {
      nome: ator ? ator.nome : '',
      nacionalidade: ator ? ator.nacionalidade : '',
      sexo: ator ? ator.sexo : '',
      editandoId: ator ? ator.id : null,
    };
  }

  handleSave = async () => {
    const { nome, nacionalidade, sexo, editandoId } = this.state;
    const { navigation } = this.props;

    if (!nome || !nacionalidade || !sexo) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos',
      });
      return;
    }
    try {
      if (editandoId) {
        await atorService.update({ id: editandoId, nome, nacionalidade, sexo });
        navigation.goBack();
        setTimeout(() => {
          navigation.setParams({
            toast: { type: 'success', msg: 'Ator atualizado com sucesso!' }
          });
        }, 100);
      } else {
        await atorService.create({ nome, nacionalidade, sexo });
        navigation.goBack();
        setTimeout(() => {
          navigation.setParams({
            toast: { type: 'success', msg: 'Ator criado com sucesso!' }
          });
        }, 100);
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  render() {
    const { nome, nacionalidade, sexo, editandoId } = this.state;
    return (
      <View style={styles.container}>
        <HeaderBar
          title={editandoId ? 'Editar Ator' : 'Adicionar Ator'}
          onBack={() => this.props.navigation.goBack()}
        />
        <AtorForm
          nome={nome}
          nacionalidade={nacionalidade}
          sexo={sexo}
          editandoId={editandoId}
          title={editandoId ? 'Editar Ator' : 'Adicionar Ator'}
          onChangeNome={(nome) => this.setState({ nome })}
          onChangeNacionalidade={(nacionalidade) => this.setState({ nacionalidade })}
          onChangeSexo={(sexo) => this.setState({ sexo })}
          onSubmit={this.handleSave}
          onCancel={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 25,
    backgroundColor: '#072330',
  },
});