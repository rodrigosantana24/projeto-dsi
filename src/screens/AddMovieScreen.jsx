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
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FilmeService from '../models/FilmeService';
import Filme from '../models/Filme';
import AddForm from '../components/addmovies/AddForm';
import AddList from '../components/addmovies/AddList';

const filmeService = new FilmeService();
export default class AddMovieScreen extends React.Component {
  state = {
    filmesCriados: [],
    filmesNativos: [],
    filmesExibidos: [],
    searchQuery: '',
    filter: 'todos',
    title: '',
    poster_path: '',
    genero: '',
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
      const criados = await filmeService.read({ useCache: false });
      const nativos = await Filme.getFilmesFromFirebase(false);
      this.setState(
        {
          filmesCriados: criados,
          filmesNativos: nativos,
        },
        this.applyFilters
      );
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os filmes');
    }
  };

  applyFilters = () => {
    const { filmesCriados, filmesNativos, filter, searchQuery } = this.state;
    let lista = [];
    if (filter === 'todos' && !searchQuery) {
      this.setState({ filmesExibidos: [] });
      return;
    }
    if (filter === 'criados') {
      lista = filmesCriados;
    } else {
      lista = [...filmesNativos, ...filmesCriados];
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      lista = lista.filter(f => f.title.toLowerCase().includes(q));
    }
    this.setState({ filmesExibidos: lista });
  };

  handleSearchChange = (text) => {
    this.setState({ searchQuery: text }, this.applyFilters);
  };

  handleFilterChange = (filter) => {
    this.setState({ filter }, this.applyFilters);
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleSave = async () => {
    const { title, poster_path, genero, editandoId } = this.state;
    if (!title || !poster_path || !genero) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }
    try {
      if (editandoId) {
        const updated = await filmeService.update({ id: editandoId, title, poster_path, genero });
        this.setState((prev) => ({ filmesCriados: prev.filmesCriados.map(f => f.id === editandoId ? updated : f) }), this.applyFilters);
      } else {
        const created = await filmeService.create({ title, poster_path, genero });
        this.setState((prev) => ({ filmesCriados: [...prev.filmesCriados, created] }), this.applyFilters);
      }
      this.setState({ title: '', poster_path: '', genero: '', editandoId: null });
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
            this.setState((prev) => ({ filmesCriados: prev.filmesCriados.filter(f => f.id !== id) }), this.applyFilters);
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
    const { title, poster_path, genero, filmesExibidos, editandoId, filter, searchQuery } = this.state;
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
            <Text style={styles.header}>{editandoId ? 'Editar Filme' : 'Novo Filme'}</Text>
          </View>

          <AddForm
            title={title}
            poster_path={poster_path}
            genero={genero}
            editandoId={editandoId}
            onChange={this.handleChange}
            onSave={this.handleSave}
          />

          <View style={styles.controlsContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar título..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={this.handleSearchChange}
            />
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'todos' && styles.activeFilter]}
                onPress={() => this.handleFilterChange('todos')}
              >
                <Text style={styles.filterText}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'criados' && styles.activeFilter]}
                onPress={() => this.handleFilterChange('criados')}
              >
                <Text style={styles.filterText}>Criados</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={filmesExibidos}
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
  container: { flex: 1, backgroundColor: '#071A24' },
  scrollContainer: { padding: 20, paddingTop: 50 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 16 },
  backButton: { position: 'absolute', left: 0, padding: 10, zIndex: 1 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#EFEFEF', textAlign: 'center' },
  controlsContainer: { marginVertical: 12 },
  searchInput: { height: 40, borderColor: '#CCC', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, color: '#FFF', marginBottom: 8 },
  filterButtons: { flexDirection: 'row' },
  filterButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#999', borderRadius: 8, marginRight: 4 },
  activeFilter: { backgroundColor: '#005F73', borderColor: '#005F73' },
  filterText: { color: '#EFEFEF', fontWeight: '600' },
  list: { marginTop: 16 },
});
