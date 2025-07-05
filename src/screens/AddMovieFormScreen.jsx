import React from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HeaderBar from '../components/navi/HeaderBar';
import FilmeService from '../services/FilmeService';
import AddForm from '../components/addmovies/AddForm';
import Genero from '../models/Genero'; 
import Ator from '../models/Ator';     

const filmeService = new FilmeService();
export default class MovieFormScreen extends React.Component {
  state = {
    title: '',
    poster_path: '',
    generos: [],
    atores: [],
    editandoId: null,
    generosList: [],
    atoresList: [],
    isModalVisible: false,
    modalData: [],
    modalTitle: '',
    editingField: null,
  };

  // CORREÇÃO: O método agora retorna as listas para uso imediato.
  fetchOptions = async () => {
    try {
      const [generosList, atoresList] = await Promise.all([
        Genero.getGenerosFromFirebase(false),
        Ator.getAtoresFromFirebase(false)
      ]);
      this.setState({ generosList, atoresList });
      return { generosList, atoresList }; // Retorna os dados carregados
    } catch (e) {
      console.error("Erro ao buscar opções:", e);
      return { generosList: [], atoresList: [] }; // Retorna vazio em caso de erro
    }
  };

  // CORREÇÃO: A lógica agora usa os dados retornados diretamente do fetchOptions.
  async componentDidMount() {
    const { generosList, atoresList } = await this.fetchOptions(); 
    const filmeParaEditar = this.props.route.params?.filme;

    if (filmeParaEditar) {
      // Usa as variáveis locais (generosList, atoresList) que garantidamente estão preenchidas
      const generosSelecionados = generosList.filter(g => filmeParaEditar.genero_ids && filmeParaEditar.genero_ids[g.id]);
      const atoresSelecionados = atoresList.filter(a => filmeParaEditar.ator_ids && filmeParaEditar.ator_ids[a.id]);

      this.setState({
        title: filmeParaEditar.title,
        poster_path: filmeParaEditar.poster_path,
        generos: generosSelecionados,
        atores: atoresSelecionados,
        editandoId: filmeParaEditar.id,
      });
    }
  }

  handleChange = (name, value) => this.setState({ [name]: value });

  handleSave = async () => {
    const { title, poster_path, generos, atores, editandoId } = this.state;
    if (!title || !poster_path || generos.length === 0 || atores.length === 0) {
      return;
    }
    try {
      const genero_ids = generos.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {});
      const ator_ids = atores.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {});

      const dataToSave = {
        title,
        poster_path,
        genero_ids,
        ator_ids,
      };

      if (editandoId) {
        await filmeService.update({ id: editandoId, ...dataToSave });
      } else {
        await filmeService.create(dataToSave);
      }
      this.props.navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao salvar o filme.');
    }
  };

  handleCancel = () => this.props.navigation.goBack();

  openModal = (field) => {
    if (field === 'generos') {
      this.setState({ isModalVisible: true, modalTitle: 'Selecione os Gêneros', modalData: this.state.generosList, editingField: 'generos' });
    } else if (field === 'atores') {
      this.setState({ isModalVisible: true, modalTitle: 'Selecione os Atores', modalData: this.state.atoresList, editingField: 'atores' });
    }
  };

  handleSelection = (item) => {
    const { editingField } = this.state;
    const currentSelection = this.state[editingField];
    if (currentSelection.some(i => i.id === item.id)) {
      this.setState({ [editingField]: currentSelection.filter(i => i.id !== item.id) });
    } else {
      this.setState({ [editingField]: [...currentSelection, item] });
    }
  };

  render() {
    const { editandoId, isModalVisible, modalTitle, modalData, editingField } = this.state;
    const currentSelection = this.state[editingField] || [];

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.headerContainer}>
          <HeaderBar
            onBack={() => this.props.navigation.goBack()}
            title={editandoId ? 'Editar Filme' : 'Adicionar Filme'}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AddForm
            {...this.state}
            isEditing={!!editandoId}
            onChange={this.handleChange}
            onSave={this.handleSave}
            onCancel={this.handleCancel}
            onOpenModal={this.openModal}
          />
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => this.setState({ isModalVisible: false })}
        >
          <TouchableWithoutFeedback onPress={() => this.setState({ isModalVisible: false })}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{modalTitle}</Text>
                    <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })}>
                      <Icon name="x" size={24} color="#B0B0B0" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={modalData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                      const isSelected = currentSelection.some(i => i.id === item.id);
                      return (
                        <TouchableOpacity style={styles.modalOption} onPress={() => this.handleSelection(item)}>
                          <Icon name={isSelected ? 'check-circle' : 'circle'} size={24} color={isSelected ? '#FFC107' : '#555'} />
                          <Text style={styles.modalOptionText}>{item.nome}</Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                  <TouchableOpacity style={styles.modalCloseButton} onPress={() => this.setState({ isModalVisible: false })}>
                    <Text style={styles.modalCloseButtonText}>Concluir</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

// Estilos não foram alterados
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#072330' },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 1, 
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#072330',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#072330',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C3F4F',
    width: '90%',
    maxHeight: '70%',
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2a5a75',
    paddingBottom: 15,
    marginBottom: 10,
  },
  modalTitle: {
    color: '#EFEFEF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  modalOptionText: {
    color: '#EFEFEF',
    fontSize: 18,
    marginLeft: 15,
  },
  modalCloseButton: {
    backgroundColor: '#FFC107',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#071A24',
    fontSize: 16,
    fontWeight: 'bold',
  },
});