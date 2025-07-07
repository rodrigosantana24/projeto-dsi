import React from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

import GeneroService from '../services/GeneroService';
import GeneroItem from '../components/genres/GeneroItem';
import HeaderBar from '../components/navi/HeaderBar';
import SearchBy from '../components/search/SearchBy';
import SelectBy from '../components/search/SelectBy';
import Toast from 'react-native-toast-message';
import CustomModal from '../components/modal/CustomModal'; 
import Icon from 'react-native-vector-icons/Feather';

const generoService = new GeneroService();
const PAGE_SIZE = 20;

export default class GenresListScreen extends React.Component {
  state = {
    generos: [],
    filteredGeneros: [],
    searchText: '',
    filterNativo: 'all',
    page: 1,
    showDeleteModal: false,
    generoParaExcluir: null,
  };

  unsubscribeFocus = null;

  async componentDidMount() {
    await this.loadGeneros();

    if (this.props.navigation?.addListener) {
      this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
        this.loadGeneros();
        this.checkToastParam();
      });
    }

    this.checkToastParam();
  }

  checkToastParam = () => {
    const toastParam = this.props.route?.params?.toast;
    if (toastParam) {
      Toast.show({
        type: toastParam.type,
        text1: toastParam.msg,
      });
      this.props.navigation.setParams({ toast: undefined });
    }
  };

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
      Alert.alert('Erro', 'Não foi possível carregar os gêneros');
    }
  };

  handleSearch = (text) => {
    this.setState({ searchText: text }, this.applyFilters);
  };

  handleFilter = (value) => {
    this.setState({ filterNativo: value }, this.applyFilters);
  };

  applyFilters = () => {
    const { generos, searchText, filterNativo } = this.state;
    let filtered = generos;

    if (searchText.trim()) {
      const term = searchText.toLowerCase();
      filtered = filtered.filter(g =>
        g.nome.toLowerCase().includes(term)
      );
    }

    if (filterNativo !== 'all') {
      const isNativo = filterNativo === 'true';
      filtered = filtered.filter(g => g.nativo === isNativo);
    }

    this.setState({ filteredGeneros: filtered, page: 1 });
  };

  handleEndReached = () => {
    const { page, filteredGeneros } = this.state;
    if ((page * PAGE_SIZE) < filteredGeneros.length) {
      this.setState({ page: page + 1 });
    }
  };

  handleDelete = (id) => {
    const genero = this.state.filteredGeneros.find(g => g.id === id);
    if (!genero || genero.nativo) return;

    this.setState({
      showDeleteModal: true,
      generoParaExcluir: genero,
    });
  };

  confirmDelete = async () => {
    const { generoParaExcluir } = this.state;
    if (!generoParaExcluir) return;

    try {
      await generoService.delete({ id: generoParaExcluir.id });
      this.setState((prev) => ({
        generos: prev.generos.filter(g => g.id !== generoParaExcluir.id),
        filteredGeneros: prev.filteredGeneros.filter(g => g.id !== generoParaExcluir.id),
        showDeleteModal: false,
        generoParaExcluir: null,
      }));
      Toast.show({
        type: 'success',
        text1: 'Gênero excluído com sucesso',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao excluir gênero');
      this.setState({ showDeleteModal: false, generoParaExcluir: null });
    }
  };

  cancelDelete = () => {
    this.setState({ showDeleteModal: false, generoParaExcluir: null });
  };

  handleRowOpen = (rowKey, rowMap) => {
    const item = this.state.filteredGeneros.find(g => g.id.toString() === rowKey);
    if (item && !item.nativo) {
      this.handleDelete(item.id);
      if (rowMap && rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
    }
  };

  render() {
    const { filteredGeneros, page, showDeleteModal, generoParaExcluir } = this.state;
    const dataToShow = filteredGeneros.slice(0, page * PAGE_SIZE);

    return (
      <View style={styles.container}>
        <HeaderBar
          title="Gêneros"
          onBack={() => this.props.navigation.goBack()}
        />

        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <SearchBy
              placeholder="Pesquisar gêneros..."
              value={this.state.searchText}
              onSearch={this.handleSearch}
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

        <SwipeListView
          data={dataToShow}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.rowFront}>
              <GeneroItem
                genero={item}
                onEdit={() => {
                  if (!item.nativo) {
                    this.props.navigation.navigate('GenresFormScreen', {
                      genero: item,
                      toast: { type: 'success', msg: 'Gênero atualizado com sucesso' },
                    });
                  }
                }}
              />
            </View>
          )}
          renderHiddenItem={({ item }, rowMap) =>
            !item.nativo && (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  style={styles.backRightBtn}
                  onPress={() => this.handleDelete(item.id)}
                >
                  <Icon name="trash-2" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            )
          }
          rightOpenValue={-75}
          disableRightSwipe={true}
          onRowOpen={this.handleRowOpen}
          onEndReached={this.handleEndReached}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            (page * PAGE_SIZE) < filteredGeneros.length
              ? <Text style={{ color: '#fff', textAlign: 'center', margin: 10 }}>Deslize para carregar mais...</Text>
              : null
          }
        />
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            this.props.navigation.navigate('GenresFormScreen', {
              toast: { type: 'success', msg: 'Gênero criado com sucesso' },
            })
          }
        >
          <MaterialIcons name="add" size={32} color="#fff" />
        </TouchableOpacity>
        
         <CustomModal
          visible={showDeleteModal}
          title="Excluir gênero"
          message={`Deseja realmente excluir${generoParaExcluir ? ` "${generoParaExcluir.nome}"` : ''}?`}
          cancelText="Cancelar"
          confirmText="Excluir"
          onCancel={this.cancelDelete}
          onConfirm={this.confirmDelete}
          confirmColor="#dc3545"
          cancelColor="#f4a03f"
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
    marginTop: 10,
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
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#f4a03f',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
  rowFront: {
    backgroundColor: '#113342',
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 80,
    flex: 1,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#D9534F',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 8,
    overflow: 'hidden',
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#D9534F',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});