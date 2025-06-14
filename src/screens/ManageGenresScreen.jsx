import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import GeneroService from '../models/GeneroService';

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
      console.log('Gêneros carregados:', generos);
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

  renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.nome}</Text>
        <Text style={styles.text}>Descrição: {item.descricao}</Text>
        {item.nativo && (
            <Text style={styles.nativo}>Gênero nativo</Text>
        )}
        {!item.nativo && (
            <View style={styles.buttons}>
            <Button title="Editar" onPress={() => this.startEdit(item)} />
            <Button title="Excluir" onPress={() => this.handleDelete(item.id)} color="red" />
            </View>
        )}
      </View>
    </TouchableOpacity>
  );

  render() {
    const { nome, descricao, generos, editandoId } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>{editandoId ? 'Editar Gênero' : 'Adicionar Gênero'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do Gênero"
          placeholderTextColor="#FFF"
          value={nome}
          onChangeText={(t) => this.setState({ nome: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          placeholderTextColor="#FFF"
          value={descricao}
          onChangeText={(t) => this.setState({ descricao: t })}
        />
        <Button
          title={editandoId ? 'Atualizar' : 'Salvar'}
          onPress={this.handleSave}
        />

        <FlatList
          data={generos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={this.renderItem}
          style={styles.list}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#192936'
  },
  header: {
    fontSize: 20,
    marginBottom: 30,
    color: '#FFF'
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
    color: '#FFF',
  },
  list: {
    marginTop: 16
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#EEE'
  },
  info: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 4,
    color: '#FFF'
  },
  text: {
    color: '#FFF',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  nativo: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#FFD700', // cor dourada para destacar
  },
});
