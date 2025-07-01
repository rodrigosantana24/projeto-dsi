import React from 'react';
import { View, FlatList, Alert, StyleSheet, Button, Text } from 'react-native';
import GeneroService from '../services/GeneroService';
import GeneroForm from '../components/genres/GeneroForm';
import GeneroItem from '../components/genres/GeneroItem';
import SearchBy from '../components/search/SearchBy';
import SelectBy from '../components/search/SelectBy';
import HeaderBar from '../components/navi/HeaderBar';

const generoService = new GeneroService();

export default class ManageGenresScreen extends React.Component {
  state = {
    generos: [],
    filteredGeneros: [],
    nome: '',
    descricao: '',
    editandoId: null,
    searchText: '',
    filterNativo: 'all',
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
      this.setState({ generos }, this.applyFilters);
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os gêneros');
    }
  };

  filterGeneros = () => {
    const { generos, searchText, filterNativo } = this.state;
    let filtered = generos;
    if (searchText) {
      filtered = filtered.filter(genero =>
        genero.nome.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterNativo !== 'all') {
      const nativoFilter = filterNativo === 'true';
      filtered = filtered.filter(genero => genero.nativo === nativoFilter);
    }
    this.setState({ filteredGeneros: filtered });
  };

  applyFilters = () => {
    const { generos, searchText, filterNativo } = this.state;
    let filtered = generos;

    if (searchText) {
      filtered = filtered.filter(genero =>
        genero.nome.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterNativo !== 'all') {
      const nativo = filterNativo === 'true';
      filtered = filtered.filter(genero => genero.nativo === nativo);
    }

    this.setState({ filteredGeneros: filtered });
  };

  handleSearch = (text) => {
    this.setState({ searchText: text }, this.applyFilters);
  };

  handleFilter = (value) => {
    this.setState({ filterNativo: value }, this.applyFilters);
  };

  handleSave = async () => {
    const { nome, descricao, editandoId } = this.state;

    if (!nome || !descricao) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }

    try {
      if (editandoId) {
        const updated = await generoService.update({ id: editandoId, nome, descricao });
        this.setState(
          (prev) => ({
            generos: prev.generos.map(g => g.id === editandoId ? updated : g),
            nome: '',
            descricao: '',
            editandoId: null,
          }),
          this.applyFilters
        );
      } else {
        const created = await generoService.create({ nome, descricao });
        this.setState(
          (prev) => ({
            generos: [...prev.generos, created],
            nome: '',
            descricao: '',
            editandoId: null,
          }),
          this.applyFilters
        );
      }
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
            this.setState(
              (prev) => ({
                generos: prev.generos.filter(g => g.id !== id)
              }),
              this.applyFilters
            );
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
          onCancel={editandoId ? () => this.setState({ nome: '', descricao: '', editandoId: null }) : null}
        />
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <SearchBy
              placeholder="Pesquisar generos..."
              onSearch={this.handleBuscaNome}
            />
          </View>
          <View style={styles.selectContainer}>
            <SelectBy
              options={[
                { label: 'Todos', value: 'all' },
                { label: 'Nativos', value: 'true' },
                { label: 'Não nativos', value: 'false' },
              ]}
              initialValue="all"
              onSelect={this.handleFilter}
            />
          </View>
        </View>
        <Text style={styles.subheader}>Gêneros cadastrados</Text>
        <FlatList
          data={this.state.filteredGeneros}
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 2,
    marginRight: 8,
  },
  selectContainer: {
    flex: 1,
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