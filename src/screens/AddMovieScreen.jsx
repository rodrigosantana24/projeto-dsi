import React from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
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

  handleDelete = id => {
    Alert.alert('Confirmar Exclusão', 'Deseja realmente excluir este filme?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await filmeService.delete({ id });
            this.loadFilmes();
          } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Falha ao excluir o filme.');
          }
        }
      }
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
        onPress={() => this.handleDelete(data.item.id)}
      >
        <Icon name="trash-2" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  renderListHeader = () => {
    const { searchQuery } = this.state;
    return (
      <View style={styles.filtersContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#888" style={{ marginLeft: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por título..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={this.handleSearchChange}
          />
        </View>
      </View>
    );
  }

  render() {
    const { filmes } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.headerButton}>
            <Icon name="arrow-left" size={24} color="#EFEFEF" />
          </TouchableOpacity>
          <Text style={styles.header}>Gerenciar Filmes</Text>
          <TouchableOpacity onPress={this.navigateToAdd} style={styles.headerButton}>
            <Icon name="plus" size={24} color="#EFEFEF" />
          </TouchableOpacity>
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
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071A24' },
  scrollContainer: { paddingHorizontal: 20 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0E2935',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1C3F4F',
  },
  header: { color: '#EFEFEF', fontSize: 20, fontWeight: 'bold' },
  headerButton: { padding: 5 },
  filtersContainer: {
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C3F4F',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a5a75',
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    padding: 12,
    fontSize: 16,
  },
  rowFront: {
    backgroundColor: '#071A24', 
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