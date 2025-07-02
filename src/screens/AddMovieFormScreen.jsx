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
import FilmeService from '../services/FilmeService';
import AddForm from '../components/addmovies/AddForm';
import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

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

  componentDidMount() {
    this.fetchOptions();
    const filmeParaEditar = this.props.route.params?.filme;
    if (filmeParaEditar) {
      this.setState({
        title: filmeParaEditar.title,
        poster_path: filmeParaEditar.poster_path,
        generos: typeof filmeParaEditar.genero === 'string' ? filmeParaEditar.genero.split(', ').filter(g => g) : [],
        atores: typeof filmeParaEditar.atores === 'string' ? filmeParaEditar.atores.split(', ').filter(a => a) : [],
        editandoId: filmeParaEditar.id,
      });
    }
  }

  fetchOptions = async () => {
    try {
      const [generosSnap, atoresSnap] = await Promise.all([
        get(ref(database, '/generos')),
        get(ref(database, '/atores'))
      ]);
      const rawGeneros = [];
      generosSnap.forEach(c => { const n = c.child('nome').val(); if (n) rawGeneros.push(n); });
      const rawAtores = [];
      atoresSnap.forEach(c => { const n = c.child('nome').val(); if (n) rawAtores.push(n); });
      const generosList = [...new Set(rawGeneros)];
      const atoresList = [...new Set(rawAtores)];
      this.setState({ generosList, atoresList });
    } catch (e) {
      console.error("Erro ao buscar opções:", e);
    }
  };


  handleChange = (name, value) => this.setState({ [name]: value });

  handleSave = async () => {
    const { title, poster_path, generos, atores, editandoId } = this.state;
    if (!title || !poster_path || generos.length === 0 || atores.length === 0) {
      return Alert.alert('Atenção', 'Todos os campos são obrigatórios.');
    }
    try {
      const dataToSave = {
        title,
        poster_path,
        genero: generos.join(', '),
        atores: atores.join(', '),
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

  handleCancel = () => {
    this.props.navigation.goBack();
  };

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
    if (currentSelection.includes(item)) {
      this.setState({ [editingField]: currentSelection.filter(i => i !== item) });
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
          <TouchableOpacity onPress={this.handleCancel} style={styles.headerButton}>
            <Icon name="arrow-left" size={24} color="#EFEFEF" />
          </TouchableOpacity>
          <Text style={styles.header}>{editandoId ? 'Editar Filme' : 'Adicionar Filme'}</Text>
          <View style={styles.headerButton} />
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AddForm
            {...this.state}
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
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item }) => {
                      const isSelected = currentSelection.includes(item);
                      return (
                        <TouchableOpacity style={styles.modalOption} onPress={() => this.handleSelection(item)}>
                          <Icon name={isSelected ? 'check-circle' : 'circle'} size={24} color={isSelected ? '#FFC107' : '#555'} />
                          <Text style={styles.modalOptionText}>{item}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071A24' },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
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
  headerButton: { width: 30 },
  header: { color: '#EFEFEF', fontSize: 20, fontWeight: 'bold' },
  
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