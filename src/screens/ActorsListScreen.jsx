import React from 'react';
import { View, FlatList, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
// Remova o import de Swipeable
import { SwipeListView } from 'react-native-swipe-list-view'; // Importe SwipeListView
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import AtorService from '../services/AtorService';
import AtorItem from '../components/actors/AtorItem';
import Ator from '../models/Ator';
import HeaderBar from '../components/navi/HeaderBar';
import SearchBy from '../components/search/SearchBy';
import SelectBy from '../components/search/SelectBy';

const atorService = new AtorService();
const PAGE_SIZE = 20;

export default class ActorsListScreen extends React.Component {
  state = {
    atores: [],
    filtroSexo: 'todos',
    buscaNome: '',
    atoresFiltrados: [],
    page: 1,
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
      Alert.alert('Erro', 'Não foi possível carregar os atores');
    }
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

  handleEndReached = () => {
    const { page, atoresFiltrados } = this.state;
    if ((page * PAGE_SIZE) < atoresFiltrados.length) {
      this.setState({ page: page + 1 });
    }
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
              atores: prev.atores.filter(g => g.id !== id),
              atoresFiltrados: prev.atoresFiltrados.filter(g => g.id !== id),
            }));
          } catch (error) {
            Alert.alert('Erro', 'Falha ao excluir ator');
          }
        },
      },
    ]);
  };

  render() {
    const { atoresFiltrados, page } = this.state;
    const dataToShow = atoresFiltrados.slice(0, page * PAGE_SIZE);

    return (
      <View style={styles.container}>
        <HeaderBar
          onBack={() => this.props.navigation.goBack()}
          title="Atores"
          rightComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ActorFormScreen')}
              style={{ marginRight: 10 }}
            >
              <MaterialIcons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          }
        />
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

        <SwipeListView
          data={dataToShow}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AtorItem
              ator={item}
              onEdit={() => this.props.navigation.navigate('ActorFormScreen', { ator: item })}
             
              hideDelete={true}
            />
          )}
          renderHiddenItem={({ item }) => (
            <View style={styles.hiddenContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => this.handleDelete(item.id)}
              >
                <MaterialIcons name="delete" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-75} 
          disableRightSwipe={false} 
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

  hiddenContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'center',
    backgroundColor: '#072330', 
    paddingRight: 10,
   
    paddingVertical: 4, 
  },
  deleteButton: {
    backgroundColor: '#c00',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '90%', 
    borderRadius: 5, 
  },
});