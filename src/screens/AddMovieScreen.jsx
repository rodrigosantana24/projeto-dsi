import React from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FilmeService from '../models/FilmeService';
import AddForm from '../components/addmovies/AddForm'; 
import AddList from '../components/addmovies/AddList'; 

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
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

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
      Alert.alert('Erro', 'Falha ao salvar o filme.');
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
    this.scrollView.scrollTo({ y: 0, animated: true });
  };

  handleDelete = (id) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja excluir este filme?', [
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
            Alert.alert('Erro', 'Falha ao excluir o filme.');
          }
        },
      },
    ]);
  };

  renderItem = ({ item }) => (
    <AddList
      item={item}
      onEdit={this.startEdit}
      onDelete={this.handleDelete}
    />
  );

  render() {
    const { title, poster_path, genero, atores, filmes, editandoId } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView 
            ref={(ref) => { this.scrollView = ref; }} 
            contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name="arrow-left" size={24} color="#EFEFEF" />
            </TouchableOpacity>
            <Text style={styles.header}>{editandoId ? 'Editar Filme' : 'Adicionar Filme'}</Text>
          </View>
          
          <AddForm
            title={title}
            poster_path={poster_path}
            genero={genero}
            atores={atores}
            editandoId={editandoId}
            onChange={this.handleChange}
            onSave={this.handleSave}
          />

          <FlatList
            data={filmes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
            style={styles.list}
            scrollEnabled={false} 
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071A24',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    position: 'relative',   
    marginBottom: 24,
  },
  backButton: {
    position: 'absolute', 
    left: 0,              
    padding: 10,          
    zIndex: 1,          
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EFEFEF',
    textAlign: 'center',
  },
  list: {
    marginTop: 16,
  },
});