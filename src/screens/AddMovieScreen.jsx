import React from 'react';
import {
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import HeaderBar from '../components/navi/HeaderBar';
import SearchBy from '../components/search/SearchBy'; 
import Icon from 'react-native-vector-icons/Feather';
import { MaterialIcons } from '@expo/vector-icons';
import FilmeService from '../services/FilmeService';
import AddList from '../components/addmovies/AddList';
import { SwipeListView } from 'react-native-swipe-list-view';

const filmeService = new FilmeService();
export default class AddMovieScreen extends React.Component {
  state = {
    filmes: [],
    allFilmes: [],
    searchQuery: '',
  };
  unsubscribeFocus = null;

  async componentDidMount() {
    this.loadFilmes();
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
      const appOnly = todos.filter(f => f.id);
      this.setState({ filmes: appOnly, allFilmes: appOnly }, this.applyFilters);
    } catch (e) {
      console.error('Erro ao carregar filmes:', e);
      Alert.alert('Erro', 'Não foi possível carregar os filmes');
    }
  };

  applyFilters = () => {
    const { allFilmes, searchQuery } = this.state;
    let filteredData = [...allFilmes];
    if (searchQuery.trim() !== '') {
      filteredData = filteredData.filter(filme =>
        filme.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    this.setState({ filmes: filteredData });
  };

  handleSearchChange = (query) => {
    this.setState({ searchQuery: query }, this.applyFilters);
  };

  handleDelete = (id, rowMap) => {
    const closeRow = () => {
      if (rowMap && rowMap[id]) {
        rowMap[id].closeRow();
      }
    };
    Alert.alert('Confirmar Exclusão', 'Deseja realmente excluir este filme?', [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: () => closeRow(),
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          closeRow();
          try {
            await filmeService.delete({ id });
            this.loadFilmes();
          } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Falha ao excluir o filme.');
          }
        },
      },
    ]);
  };

  navigateToEdit = (filme) => {
    this.props.navigation.navigate('MovieFormScreen', { filme });
  };

  navigateToAdd = () => {
    this.props.navigation.navigate('MovieFormScreen');
  };

  renderItem = (data) => (
    <TouchableOpacity
      style={styles.rowFront}
      activeOpacity={0.9}
      onPress={() => this.navigateToEdit(data.item)}
    >
      <AddList item={data.item} />
    </TouchableOpacity>
  );

  renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => this.handleDelete(data.item.id, rowMap)}
      >
        <Icon name="trash-2" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  renderListHeader = () => {
    return (
      <View style={styles.filtersContainer}>
        <SearchBy
          placeholder="Pesquisar por título..."
          onSearch={this.handleSearchChange}
        />
      </View>
    );
  }

  render() {
    const { filmes } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderBar
            onBack={() => this.props.navigation.goBack()}
            title="Gerenciar Filmes"
          />
        </View>

        <SwipeListView
          data={filmes}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-75}
          keyExtractor={f => f.id.toString()}
          ListHeaderComponent={this.renderListHeader}
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponentStyle={{ marginBottom: 8 }}
          useNativeDriver={false}
          disableRightSwipe={true}
          onRowOpen={(rowKey, rowMap) => {
            this.handleDelete(rowKey, rowMap);
          }}
        />

        <TouchableOpacity onPress={this.navigateToAdd} style={styles.addButton}>
          <MaterialIcons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#072330' },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  headerContainer: {
    backgroundColor: '#072330',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#072330',
  },
  header: { color: '#EFEFEF', fontSize: 20, fontWeight: 'bold' },
  addButton: {
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
  filtersContainer: {
    paddingVertical: 10,
  },
  rowFront: {
    backgroundColor: '#072330',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#D9534F',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#D9534F',
    right: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});