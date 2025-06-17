import React from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import FilmeService from '../models/FilmeService';
import AddForm from '../components/addmovies/AddForm'; 
import AddList from '../components/addmovies/AddList';
import { database } from '../configs/firebaseConfig';
import { ref, get } from 'firebase/database';

const filmeService = new FilmeService();
export default class AddMovieScreen extends React.Component {
  state = {
    filmes: [],
    title: '',
    poster_path: '',
    genero: '',
    atores: '',
    editandoId: null,
    generosList: [],
    atoresList: []
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
      this.setState({ filmes: appOnly });
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

  handleChange = (name, value) => this.setState({ [name]: value });

  handleSave = async () => {
    const { title, poster_path, genero, atores, editandoId } = this.state;
    if (!title || !poster_path || !genero || !atores) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }
    try {
      let result;
      if (editandoId) {
        result = await filmeService.update({ id: editandoId, title, poster_path, genero, atores });
        this.setState(prev => ({ filmes: prev.filmes.map(f => f.id === editandoId ? result : f) }));
      } else {
        result = await filmeService.create({ title, poster_path, genero, atores });
        this.setState(prev => ({ filmes: [...prev.filmes, result] }));
      }
      this.setState({ title: '', poster_path: '', genero: '', atores: '', editandoId: null });
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
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try {
          await filmeService.delete({ id });
          this.setState(prev => ({ filmes: prev.filmes.filter(f => f.id !== id) }));
        } catch (e) { console.error(e); Alert.alert('Erro', 'Falha ao excluir.'); }
      }}
    ]);
  };

  render() {
    const { filmes, ...formProps } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        <FlatList
          ref={ref => this.listRef = ref}
          data={filmes}
          keyExtractor={f => f.id.toString()}
          renderItem={({ item }) => <AddList item={item} onEdit={this.startEdit} onDelete={this.handleDelete}/>}          
          ListHeaderComponent={<AddForm {...formProps} onChange={this.handleChange} onSave={this.handleSave}/>}          
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponentStyle={{ marginBottom: 16 }}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071A24' },
  scrollContainer: { padding: 20, paddingTop: 50 },
});