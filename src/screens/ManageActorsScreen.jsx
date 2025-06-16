import React from 'react';
import { View, FlatList, Alert, StyleSheet, Text, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import AtorService from '../models/AtorService';
import AtorForm from '../components/actors/AtorForm';
import AtorItem from '../components/actors/AtorItem';
import Ator from '../models/Ator'; 
import HeaderBar from '../components/navi/HeaderBar';

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

  // Sempre que filtrar/buscar, reseta a página para 1
  buscarPorNome = () => {
    const { atores, buscaNome } = this.state;
    if (!buscaNome.trim()) {
      this.setState({ atoresFiltrados: atores, page: 1 });
      Keyboard.dismiss();
      return;
    }
    const termo = buscaNome.trim().toLowerCase();
    const filtrados = atores.filter(a => a.nome.toLowerCase().startsWith(termo));
    this.setState({ atoresFiltrados: filtrados, page: 1 });
    Keyboard.dismiss();
  };

  setFiltroSexo = async (filtroSexo) => {
    await this.setState({ filtroSexo, buscaNome: '', page: 1 });
    await this.loadAtores();
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
          onBack={() => this.props.navigation.navigate('Menu')}
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

        {/* Filtros de sexo */}
        <View style={styles.filtrosContainer}>
          <TouchableOpacity
            style={[styles.filtroBotao, filtroSexo === 'todos' && styles.filtroSelecionado]}
            onPress={() => this.setFiltroSexo('todos')}
          >
            <Text style={styles.filtroTexto}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filtroBotao, filtroSexo === 'Masculino' && styles.filtroSelecionado]}
            onPress={() => this.setFiltroSexo('Masculino')}
          >
            <Text style={styles.filtroTexto}>Masculino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filtroBotao, filtroSexo === 'Feminino' && styles.filtroSelecionado]}
            onPress={() => this.setFiltroSexo('Feminino')}
          >
            <Text style={styles.filtroTexto}>Feminino</Text>
          </TouchableOpacity>
        </View>

        {/* Campo de busca por nome */}
        <TextInput
          style={styles.inputBusca}
          placeholder="Digite o nome do ator"
          placeholderTextColor="#aaa"
          value={buscaNome}
          onChangeText={this.handleBuscaNome}
          onSubmitEditing={this.buscarPorNome}
          returnKeyType="search"
        />

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
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    marginTop: -4,
    marginLeft: 4,
  },
  filtrosContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'center',
  },
  filtroBotao: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#0a3d5c',
  },
  filtroSelecionado: {
    backgroundColor: '#1e90ff',
  },
  filtroTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputBusca: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    marginTop: 10,
    fontSize: 16,
    color: '#222',
  },
});
