import React from 'react';
import { View, FlatList, Alert, StyleSheet, Text } from 'react-native';
import AtorService from '../services/AtorService';
import AtorForm from '../components/actors/AtorForm';
import AtorItem from '../components/actors/AtorItem';
import Ator from '../models/Ator'; 
import HeaderBar from '../components/navi/HeaderBar';
import SearchBy from '../components/search/SearchBy';
import SelectBy from '../components/search/SelectBy';

const atorService = new AtorService();
const PAGE_SIZE = 20;

export default class ManageActorsScreen extends React.Component {
  state = {
    atores: [],
    nome: '',
    nacionalidade: '',
    sexo: '',
    editandoId: null,
    filtroSexo: 'todos',
    buscaNome: '',
    atoresFiltrados: [],
    page: 1, // novo estado
    loadingMore: false, // novo estado
  };

  unsubscribeFocus = null;

  async componentDidMount() {
    await this.loadAtores();
    if (this.props.navigation && this.props.navigation.addListener) {
      this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
        this.loadAtores();
      });
    }
  }
  componentWillUnmount() {
    if (this.unsubscribeFocus) {
      this.unsubscribeFocus();
    }
  }
  loadAtores = async () => {
    try {
      let atores = [];
      if (this.state.filtroSexo === 'todos') {
        atores = await atorService.read({ useCache: false });
      } else {
        atores = await Ator.getAtoresBySexoFromFirebase(this.state.filtroSexo, false);
      }
      this.setState({ atores, atoresFiltrados: atores });
    } catch (error) {
      console.error('Erro ao carregar atores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os atores');
    }
  };
  handleSave = async () => {
    const { nome, nacionalidade, sexo, editandoId } = this.state;

    if (!nome || !nacionalidade || !sexo) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }
    try {
      if (editandoId) {
        const updated = await atorService.update({ id: editandoId, nome, nacionalidade, sexo });
        this.setState((prev) => ({
          atores: prev.atores.map(g => g.id === editandoId ? updated : g),
        }));
      } else {
        const created = await atorService.create({ nome, nacionalidade, sexo });
        this.setState((prev) => ({ atores: [...prev.atores, created] }));
      }

      this.setState({ nome: '', nacionalidade: '', sexo: '', editandoId: null });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.message);
    }
  };
  startEdit = (ator) => {
    this.setState({
      nome: ator.nome,
      nacionalidade: ator.nacionalidade,
      sexo: ator.sexo,
      editandoId: ator.id,
    });
  };
  handleDelete = (id) => {
    Alert.alert('Confirmar', 'Deseja excluir este ator?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await atorService.delete({ id });
            this.setState((prev) => ({
              atores: prev.atores.filter(g => g.id !== id)
            }));
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao excluir ator');
          }
        },
      },
    ]);
  };

  setFiltroSexo = async (filtroSexo) => {
    await this.setState({ filtroSexo, buscaNome: '', page: 1 });
    await this.loadAtores();
  };

  handleBuscaNome = (buscaNome) => {
    this.setState({ buscaNome }, this.applyFilters);
  };

  applyFilters = () => {
    const { atores, buscaNome, filtroSexo } = this.state;
    let filtrados = atores;

    if (filtroSexo !== 'todos') {
      filtrados = filtrados.filter(a => a.sexo === filtroSexo);
    }
    if (buscaNome.trim()) {
      const termo = buscaNome.trim().toLowerCase();
      filtrados = filtrados.filter(a => a.nome.toLowerCase().includes(termo));
    }
    this.setState({ atoresFiltrados: filtrados, page: 1 });
  };

  // Função chamada ao chegar no fim da lista
  handleEndReached = () => {
    const { page, atoresFiltrados } = this.state;
    if ((page * PAGE_SIZE) < atoresFiltrados.length) {
      this.setState({ page: page + 1 });
    }
  };

  render() {
    const { atoresFiltrados, nome, nacionalidade, sexo, editandoId, filtroSexo, buscaNome, page } = this.state;

    // Mostra apenas os itens da página atual
    const dataToShow = atoresFiltrados.slice(0, page * PAGE_SIZE);

    return (
      <View style={styles.container}>
        <HeaderBar
          title="Gerenciar Atores"
          onBack={() => navigation.goBack()}
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
          onCancel={editandoId ? () => this.setState({ nome: '', nacionalidade: '', sexo: '', editandoId: null }) : null}
        />

        {/* Filtros e busca */}
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <SearchBy
              placeholder="Pesquisar atores..."
              onSearch={this.handleBuscaNome}
            />
          </View>
          <View style={styles.selectContainer}>
            <SelectBy
              options={[
                { label: 'Todos', value: 'todos' },
                { label: 'Masculino', value: 'Masculino' },
                { label: 'Feminino', value: 'Feminino' },
              ]}
              initialValue="todos"
              onSelect={this.setFiltroSexo}
            />
          </View>
        </View>

        <Text style={styles.subheader}>Atores cadastrados</Text>
        <FlatList
          data={dataToShow}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AtorItem
              ator={item}
              onEdit={() => this.startEdit(item)}
              onDelete={() => this.handleDelete(item.id)}
            />
          )}
          onEndReached={this.handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            (page * PAGE_SIZE) < atoresFiltrados.length
              ? <Text style={{ color: '#fff', textAlign: 'center', margin: 10 }}>Deslize para carregar mais...</Text>
              : null
          }
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
