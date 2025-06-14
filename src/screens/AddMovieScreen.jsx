import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FilmeService from '../models/FilmeService';

const filmeService = new FilmeService();

export default class AddMovieScreen extends React.Component {
  state = {
    filmes: [], 
    title: '',
    poster_path: '',
    genero: '',
    atores: '',
    editandoId: null,
  };

    unsubscribeFocus = null;

  async componentDidMount() {
    this.loadFilmes();

    // Se estiver usando React Navigation
    if (this.props.navigation && this.props.navigation.addListener) {
      this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
        this.loadFilmes();
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribeFocus) {
      this.unsubscribeFocus();
    }
  }

  loadFilmes = async () => {
    try {
      const todosFilmes = await filmeService.read({ useCache: false });
      const filmesDoApp = todosFilmes.filter(filme => filme.id?.startsWith('-OS'));
      this.setState({ filmes: filmesDoApp });
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os filmes');
    }
  }

  handleSave = async () => {
    const { title, poster_path, genero, atores, editandoId } = this.state;

    if (!title || !poster_path || !genero || !atores) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }

    try {
      if (editandoId) {
        const updated = await filmeService.update({ id: editandoId, title, poster_path, genero, atores });
        this.setState((prev) => ({
          filmes: prev.filmes.map(f => f.id === editandoId ? updated : f),
        }));
      } else {
        const created = await filmeService.create({ title, poster_path, genero, atores });
        this.setState((prev) => ({ filmes: [...prev.filmes, created] }));
      }

      this.setState({ title: '', poster_path: '', genero: '', atores: '', editandoId: null });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.message);
    }
  };

  startEdit = (filme) => {
    this.setState({
      title: filme.title,
      poster_path: filme.poster_path,
      genero: filme.genero,
      atores: filme.atores,
      editandoId: filme.id,
    });
  };

  handleDelete = (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este filme?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await filmeService.delete({ id });
            this.setState((prev) => ({ filmes: prev.filmes.filter(f => f.id !== id) }));
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao excluir filme');
          }
        },
      },
    ]);
  };

  renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      {item.poster_path && (
        <Image source={{ uri: item.getImageUrl() }} style={styles.poster} />
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>Gênero: {item.genero}</Text>
        <Text style={styles.text}>Atores: {item.atores}</Text>
        <View style={styles.buttons}>
          <Button title="Editar" onPress={() => this.startEdit(item)} />
          <Button title="Excluir" onPress={() => this.handleDelete(item.id)} color="red" />
        </View>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { title, poster_path, genero, atores, filmes, editandoId } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{editandoId ? 'Editar Filme' : 'Adicionar Filme'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor="#FFF"
          value={title}
          onChangeText={(t) => this.setState({ title: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="URL do Poster"
          placeholderTextColor="#FFF"
          value={poster_path}
          onChangeText={(t) => this.setState({ poster_path: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Gênero"
          placeholderTextColor="#FFF"
          value={genero}
          onChangeText={(t) => this.setState({ genero: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Atores (separados por vírgula)"
          placeholderTextColor="#FFF"
          value={atores}
          onChangeText={(t) => this.setState({ atores: t })}
        />
        <Button
          title={editandoId ? 'Atualizar' : 'Salvar'}
          onPress={this.handleSave}
        />

        <FlatList
          data={filmes}
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
    flexDirection: 'row', 
    padding: 12, 
    borderBottomWidth: 1, 
    borderColor: '#EEE' 
  },
  poster: { 
    width: 64, 
    height: 96, 
    marginRight: 12 
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
});
