import React from 'react';
import { View, FlatList, Alert, StyleSheet, Button, Text } from 'react-native';
import GeneroService from '../models/GeneroService';
import GeneroForm from '../components/genres/GeneroForm';
import GeneroItem from '../components/genres/GeneroItem';
import HeaderBar from '../components/navi/HeaderBar';

const generoService = new GeneroService();

export default class ManageGenresScreen extends React.Component {
  state = {
    generos: [],
    nome: '',
    descricao: '',
    editandoId: null,
  };

  unsubscribeFocus = null;

  async componentDidMount() {
    this.loadGeneros();
    if (this.props.navigation && this.props.navigation.addListener) {
      this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
        this.loadGeneros();
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribeFocus) {
      this.unsubscribeFocus();
    }
  }

  loadGeneros = async () => {
    try {
      const generos = await generoService.read({ useCache: false });
      this.setState({ generos });
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os gêneros');
    }
  };

  handleSave = async () => {
    const { nome, descricao, editandoId } = this.state;

    if (!nome || !descricao) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }

    try {
      if (editandoId) {
        const updated = await generoService.update({ id: editandoId, nome, descricao });
        this.setState((prev) => ({
          generos: prev.generos.map(g => g.id === editandoId ? updated : g),
        }));
      } else {
        const created = await generoService.create({ nome, descricao });
        this.setState((prev) => ({ generos: [...prev.generos, created] }));
      }

      this.setState({ nome: '', descricao: '', editandoId: null });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.message);
    }
  };

  startEdit = (genero) => {
    this.setState({
      nome: genero.nome,
      descricao: genero.descricao,
      editandoId: genero.id,
    });
  };

  handleDelete = (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este gênero?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await generoService.delete({ id });
            this.setState((prev) => ({
              generos: prev.generos.filter(g => g.id !== id)
            }));
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao excluir gênero');
          }
        },
      },
    ]);
  };

  render() {
    const { generos, nome, descricao, editandoId } = this.state;

    return (
      <View style={styles.container}>
        <HeaderBar
          title="Gerenciar Gêneros"
          onBack={() => this.props.navigation.navigate('Menu')}
        />
        <GeneroForm
          nome={nome}
          descricao={descricao}
          editandoId={editandoId}
          title={editandoId ? 'Editar Gênero' : 'Adicionar Gênero'}
          onChangeNome={(nome) => this.setState({ nome })}
          onChangeDescricao={(descricao) => this.setState({ descricao })}
          onSubmit={this.handleSave}
          onCancel={editandoId ? () => this.setState({ nome: '', descricao: '', editandoId: null }) : null}
        />
        <Text style={styles.subheader}>Gêneros cadastrados</Text>
        <FlatList
          data={generos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <GeneroItem
              genero={item}
              onEdit={() => this.startEdit(item)}
              onDelete={() => this.handleDelete(item.id)}
            />
          )}
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
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    marginTop: -4,
    marginLeft: 4,
  },
});
