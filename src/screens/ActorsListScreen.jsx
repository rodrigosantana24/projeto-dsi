import React from 'react';
import { View, FlatList, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view'; 
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import AtorService from '../services/AtorService';
import AtorItem from '../components/actors/AtorItem';
import Ator from '../models/Ator';
import HeaderBar from '../components/navi/HeaderBar';
import SearchBy from '../components/search/SearchBy';
import SelectBy from '../components/search/SelectBy';
import Toast from 'react-native-toast-message';
import CustomModal from '../components/modal/CustomModal';
import Icon from 'react-native-vector-icons/Feather';

const atorService = new AtorService();
const PAGE_SIZE = 20;

export default class ActorsListScreen extends React.Component {
  state = {
    atores: [],
    filtroSexo: 'Sexo',
    buscaNome: '',
    atoresFiltrados: [],
    page: 1,
    showDeleteModal: false,
    atorParaExcluir: null,
    rowMapToDelete: null, // novo
  };

  unsubscribeFocus = null;

  async componentDidMount() {
    await this.loadAtores();
    if (this.props.navigation && this.props.navigation.addListener) {
      this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
        this.loadAtores();
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

  loadAtores = async () => {
    try {
      const atores = await atorService.read({ useCache: false });
      this.setState({ atores }, this.applyFilters);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os atores');
    }
  };

  setFiltroSexo = (filtroSexo) => {
    this.setState({ filtroSexo, page: 1 }, this.applyFilters);
  };

  handleBuscaNome = (buscaNome) => {
    this.setState({ buscaNome, page: 1 }, this.applyFilters);
  };

  applyFilters = () => {
    const { atores, buscaNome, filtroSexo } = this.state;
    let filtrados = atores;

    // Aplica filtro de sexo se não for "Sexo"
    if (filtroSexo !== 'Sexo') {
      filtrados = filtrados.filter(a => a.sexo === filtroSexo);
    }
    // Aplica filtro de nome se não estiver vazio
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

  handleDelete = (id, rowMap) => {
    const ator = this.state.atoresFiltrados.find(a => a.id === id);
    this.setState({ showDeleteModal: true, atorParaExcluir: ator, rowMapToDelete: rowMap });
  };

  handleCancelDelete = () => {
    const { rowMapToDelete, atorParaExcluir } = this.state;
    if (rowMapToDelete && atorParaExcluir && rowMapToDelete[atorParaExcluir.id]) {
      rowMapToDelete[atorParaExcluir.id].closeRow();
    }
    this.setState({ showDeleteModal: false, atorParaExcluir: null, rowMapToDelete: null });
  };

  confirmDelete = async () => {
    const { atorParaExcluir } = this.state;
    if (!atorParaExcluir) return;
    try {
      await atorService.delete({ id: atorParaExcluir.id });
      this.setState((prev) => ({
        atores: prev.atores.filter(g => g.id !== atorParaExcluir.id),
        atoresFiltrados: prev.atoresFiltrados.filter(g => g.id !== atorParaExcluir.id),
        showDeleteModal: false,
        atorParaExcluir: null,
        rowMapToDelete: null,
      }));
      Toast.show({
        type: 'success',
        text1: 'Ator excluído com sucesso',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao excluir ator');
      this.setState({ showDeleteModal: false, atorParaExcluir: null, rowMapToDelete: null });
    }
  };

  renderItem = (data) => (
    <TouchableOpacity
      style={styles.rowFront}
      activeOpacity={0.9}
      onPress={() =>
        this.props.navigation.navigate('ActorFormScreen', { ator: data.item })
      }
    >
      <AtorItem ator={data.item} />
    </TouchableOpacity>
  );

  renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => this.handleDelete(data.item.id, rowMap)}
      >
        <Icon name="trash-2" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  showToast = (msg, type) => {
    Toast.show({
      type: type === 'success' ? 'success' : 'error',
      text1: msg,
    });
    this.loadAtores();
  };

  render() {
    const { atoresFiltrados, page, filtroSexo, buscaNome, showDeleteModal, atorParaExcluir } = this.state;
    const dataToShow = atoresFiltrados.slice(0, page * PAGE_SIZE);

    return (
      <View style={styles.container}>
        <HeaderBar
          onBack={() => this.props.navigation.goBack()}
          title="Atores"
        />
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <SearchBy
              placeholder="Pesquisar atores..."
              value={buscaNome}
              onSearch={this.handleBuscaNome}
            />
          </View>
          <View style={styles.selectContainer}>
            <SelectBy
              options={[
                { label: 'Sexo', value: 'Sexo' },
                { label: 'Masculino', value: 'Masculino' },
                { label: 'Feminino', value: 'Feminino' },
              ]}
              initialValue="Sexo"
              value={filtroSexo}
              onSelect={this.setFiltroSexo}
            />
          </View>
        </View>
        <Text style={styles.subheader}>Atores cadastrados</Text>

        <SwipeListView
          data={dataToShow}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-75}
          keyExtractor={(item) => item.id.toString()}
          disableRightSwipe={true}
          onEndReached={this.handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            (page * PAGE_SIZE) < atoresFiltrados.length
              ? <Text style={{ color: '#fff', textAlign: 'center', margin: 10 }}>Deslize para carregar mais...</Text>
              : null
          }
          useNativeDriver={false}
          onRowOpen={(rowKey, rowMap) => {
            this.handleDelete(rowKey, rowMap);
          }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />

        {/* FAB - Botão flutuante */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            this.props.navigation.navigate('ActorFormScreen')
          }
        >
          <MaterialIcons name="add" size={32} color="#fff" />
        </TouchableOpacity>

        {/* CustomModal para exclusão */}
        <CustomModal
          visible={showDeleteModal}
          title="Excluir ator"
          message={`Deseja realmente excluir${atorParaExcluir ? ` "${atorParaExcluir.nome}"` : ''}?`}
          cancelText="Cancelar"
          confirmText="Excluir"
          onCancel={this.handleCancelDelete}
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
  rowFront: {
    backgroundColor: '#072330',
    borderRadius: 8, // Adicione esta linha
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#D9534F',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 8, // Adicione esta linha
    overflow: 'hidden', // Garante que o conteúdo não ultrapasse a borda arredondada
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
    borderTopRightRadius: 8, // Adicione para acompanhar a curvatura
    borderBottomRightRadius: 8, // Adicione para acompanhar a curvatura
  },
  backRightBtnRight: {
    backgroundColor: '#D9534F',
    right: 0,
    borderTopRightRadius: 8, // Adicione para acompanhar a curvatura
    borderBottomRightRadius: 8, // Adicione para acompanhar a curvatura
  },
});