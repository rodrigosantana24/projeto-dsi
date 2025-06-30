import React from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FilmeService from '../services/FilmeService';
import AddForm from '../components/addmovies/AddForm';
import AddList from '../components/addmovies/AddList';
import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

const filmeService = new FilmeService();
export default class AddMovieScreen extends React.Component {
  state = {
    title: '',
    poster_path: '',
    genero: '',
    atores: '',
    editandoId: null,
    filmes: [],      
    allFilmes: [],  
    generosList: [],
    atoresList: [],
    searchQuery: '',
    selectedGenre: '', 
    isGenreFilterModalVisible: false,
  };
  unsubscribeFocus = null;

  async componentDidMount() {
    this.loadFilmes();
    this.fetchGeneros();
    this.fetchAtores();
    if (this.props.navigation?.addListener) {
      this.unsubscribeFocus = this.props.navigation.addListener('focus', this.loadFilmes);
    }
  }

  componentWillUnmount() {
    this.unsubscribeFocus?.();
  }

  loadFilmes = async () => {
    try {
      const todos = await filmeService.read({ useCache: false });
      const appOnly = todos.filter(f => f.id?.startsWith('-OS'));
      this.setState({ filmes: appOnly, allFilmes: appOnly }, this.applyFilters);
    } catch (e) {
      console.error('Erro ao carregar filmes:', e);
      Alert.alert('Erro', 'Não foi possível carregar os filmes');
    }
  };

  fetchGeneros = async () => {
    try {
      const snap = await get(ref(database, '/generos'));
      const list = [];
      snap.forEach(c => { const n = c.child('nome').val(); if (n) list.push(n); });
      this.setState({ generosList: list });
    } catch (e) { console.error(e); }
  };

  fetchAtores = async () => {
    try {
      const snap = await get(ref(database, '/atores'));
      const list = [];
      snap.forEach(c => { const n = c.child('nome').val(); if (n) list.push(n); });
      this.setState({ atoresList: list });
    } catch (e) { console.error(e); }
  };

  applyFilters = () => {
    const { allFilmes, searchQuery, selectedGenre } = this.state;
    let filteredData = [...allFilmes];
    if (searchQuery.trim() !== '') {
      filteredData = filteredData.filter(filme =>
        filme.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedGenre) {
      filteredData = filteredData.filter(filme => filme.genero === selectedGenre);
    }

    this.setState({ filmes: filteredData });
  };

  handleChange = (name, value) => this.setState({ [name]: value });

  handleSearchChange = (query) => {
    this.setState({ searchQuery: query }, this.applyFilters);
  };

  handleGenreFilterSelect = (genre) => {
    this.setState({ selectedGenre: genre, isGenreFilterModalVisible: false }, this.applyFilters);
  };

  handleSave = async () => {
    const { title, poster_path, genero, atores, editandoId } = this.state;
    if (!title || !poster_path || !genero || !atores) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }
    try {
      if (editandoId) {
        await filmeService.update({ id: editandoId, title, poster_path, genero, atores });
      } else {
        await filmeService.create({ title, poster_path, genero, atores });
      }
      this.setState({ title: '', poster_path: '', genero: '', atores: '', editandoId: null });
      this.loadFilmes();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao salvar o filme.');
    }
  };

  startEdit = filme => {
    this.setState({
      title: filme.title,
      poster_path: filme.poster_path,
      genero: filme.genero,
      atores: filme.atores,
      editandoId: filme.id,
    }, () => this.listRef.scrollToOffset({ offset: 0, animated: true }));
  };

  handleDelete = id => {
    Alert.alert('Confirmar', 'Deseja excluir este filme?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await filmeService.delete({ id });
            this.loadFilmes(); 
          } catch (e) { console.error(e); Alert.alert('Erro', 'Falha ao excluir.'); }
        }
      }
    ]);
  };
  
  renderListHeader = () => {
    const { title, poster_path, genero, atores, editandoId, generosList, atoresList, searchQuery, selectedGenre } = this.state;
    const formProps = { title, poster_path, genero, atores, editandoId, generosList, atoresList };

    return (
      <View>
        <AddForm {...formProps} onChange={this.handleChange} onSave={this.handleSave} />
        <View style={styles.filtersContainer}>
            <View style={styles.searchBar}>
                <Icon name="search" size={20} color="#888" style={{marginLeft: 8}}/>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar por título..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={this.handleSearchChange}
                />
            </View>
            <TouchableOpacity 
                style={styles.selectButton} 
                onPress={() => this.setState({isGenreFilterModalVisible: true})}>
                <Text style={styles.selectButtonText}>{selectedGenre || 'Filtrar por Gênero'}</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const { filmes, generosList, isGenreFilterModalVisible, editandoId } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#EFEFEF" />
          </TouchableOpacity>
          <Text style={styles.header}>{editandoId ? 'Editar Filme' : 'Adicionar Filme'}</Text>
        </View>

        <FlatList
          ref={ref => this.listRef = ref}
          data={filmes}
          keyExtractor={f => f.id.toString()}
          renderItem={({ item }) => <AddList item={item} onEdit={this.startEdit} onDelete={this.handleDelete} />}
          ListHeaderComponent={this.renderListHeader}
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponentStyle={{ marginBottom: 16 }}
        />

        <Modal
            animationType="slide"
            transparent={false}
            visible={isGenreFilterModalVisible}
            onRequestClose={() => this.setState({isGenreFilterModalVisible: false})}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Filtrar por Gênero</Text>
                    <TouchableOpacity onPress={() => this.setState({isGenreFilterModalVisible: false})}>
                        <Icon name="x" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={['', ...generosList]} 
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.modalOption} onPress={() => this.handleGenreFilterSelect(item)}>
                            <Text style={styles.modalOptionText}>{item || 'Todos os Gêneros'}</Text>
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071A24' },
  scrollContainer: { padding: 20, paddingTop: 20 },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E2935',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1C3F4F',
  },
  backButton: { marginRight: 10 },
  header: { color: '#EFEFEF', fontSize: 20, fontWeight: 'bold' },

  filtersContainer: {
    backgroundColor: '#0E2935',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#1C3F4F'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#1C3F4F',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a5a75',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    padding: 12,
    fontSize: 16,
  },
  selectButton: {
    backgroundColor: '#1C3F4F',
    borderWidth: 1,
    borderColor: '#2a5a75',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#FFF',
    fontSize: 16,
  },

  modalContainer: { flex: 1, backgroundColor: '#071A24' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1C3F4F' },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  modalOption: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#1C3F4F' },
  modalOptionText: { color: '#FFF', fontSize: 18 },
});
