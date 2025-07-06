import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import GeneroService from '../services/GeneroService';
import GeneroForm from '../components/genres/GeneroForm';
import HeaderBar from '../components/navi/HeaderBar';
import Toast from 'react-native-toast-message';

const generoService = new GeneroService();

export default class GeneroFormScreen extends React.Component {
  constructor(props) {
    super(props);
    const genero = props.route?.params?.genero;
    this.state = {
      nome: genero ? genero.nome : '',
      descricao: genero ? genero.descricao : '',
      editandoId: genero ? genero.id : null,
    };
  }

  handleSave = async () => {
    const { nome, descricao, editandoId } = this.state;
    const { navigation } = this.props;

    try {
      if (editandoId) {
        await generoService.update({ id: editandoId, nome, descricao });
        Toast.show({
          type: 'success',
          text1: 'Gênero atualizado',
        });
      } else {
        await generoService.create({ nome, descricao });
        navigation.replace('GenresListScreen', {
          toast: { type: 'success', msg: 'Gênero criado' },
        });
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };


  render() {
    const { nome, descricao, editandoId } = this.state;
    return (
      <View style={styles.container}>
        <HeaderBar
          title={editandoId ? 'Editar Gênero' : 'Adicionar Gênero'}
          onBack={() => this.props.navigation.goBack()}
        />
        <GeneroForm
          nome={nome}
          descricao={descricao}
          editandoId={editandoId}
          title={editandoId ? 'Editar Gênero' : 'Adicionar Gênero'}
          onChangeNome={(nome) => this.setState({ nome })}
          onChangeDescricao={(descricao) => this.setState({ descricao })}
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