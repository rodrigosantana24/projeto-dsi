import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; 
import FilmeService from '../models/FilmeService';

const filmeService = new FilmeService();
export default class AddMovieScreen extends React.Component {
  state = {
    filmes: [],
    title: '',
    poster_path: '',
    genero: '',
    atores: '',
    editandoId: null,
  };
  unsubscribeFocus = null;

  async componentDidMount() {
    this.loadFilmes();
    if (this.props.navigation && this.props.navigation.addListener) {
      this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
        this.loadFilmes();
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribeFocus) {
      this.unsubscribeFocus();
    }
  }

  loadFilmes = async () => {
    try {
      const todosFilmes = await filmeService.read({ useCache: false });
      const filmesDoApp = todosFilmes.filter(filme => filme.id?.startsWith('-OS'));
      this.setState({ filmes: filmesDoApp });
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os filmes');
    }
  }

  handleSave = async () => {
    const { title, poster_path, genero, atores, editandoId } = this.state;

    if (!title || !poster_path || !genero || !atores) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }
    try {
      if (editandoId) {
        const updated = await filmeService.update({ id: editandoId, title, poster_path, genero, atores });
        this.setState((prev) => ({
          filmes: prev.filmes.map(f => f.id === editandoId ? updated : f),
        }));
      } else {
        const created = await filmeService.create({ title, poster_path, genero, atores });
        this.setState((prev) => ({ filmes: [...prev.filmes, created] }));
      }

      this.setState({ title: '', poster_path: '', genero: '', atores: '', editandoId: null });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.message);
    }
  };

  startEdit = (filme) => {
    this.setState({
      title: filme.title,
      poster_path: filme.poster_path,
      genero: filme.genero,
      atores: filme.atores,
      editandoId: filme.id,
    });
  };

  handleDelete = (id) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja excluir este filme?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await filmeService.delete({ id });
            this.setState((prev) => ({ filmes: prev.filmes.filter(f => f.id !== id) }));
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao excluir o filme.');
          }
        },
      },
    ]);
  };

  renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.poster_path && (
        <Image source={{ uri: item.getImageUrl() }} style={styles.poster} />
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>Gênero: {item.genero}</Text>
        <Text style={styles.text}>Atores: {item.atores}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => this.startEdit(item)}>
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => this.handleDelete(item.id)}>
            <Text style={styles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  render() {
    const { title, poster_path, genero, atores, filmes, editandoId } = this.state;
    return (
      <KeyboardAvoidingView
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* --- ÁREA MODIFICADA --- */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name="arrow-left" size={24} color="#EFEFEF" />
            </TouchableOpacity>
            <Text style={styles.header}>{editandoId ? 'Editar Filme' : 'Adicionar Filme'}</Text>
          </View>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Título do Filme"
              placeholderTextColor="#888"
              value={title}
              onChangeText={(t) => this.setState({ title: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="URL do Poster"
              placeholderTextColor="#888"
              value={poster_path}
              onChangeText={(t) => this.setState({ poster_path: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Gênero"
              placeholderTextColor="#888"
              value={genero}
              onChangeText={(t) => this.setState({ genero: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Atores (separados por vírgula)"
              placeholderTextColor="#888"
              value={atores}
              onChangeText={(t) => this.setState({ atores: t })}
            />

            <TouchableOpacity style={styles.saveButton} onPress={this.handleSave}>
              <Text style={styles.saveButtonText}>
                {editandoId ? 'Atualizar Filme' : 'Salvar Filme'}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filmes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
            style={styles.list}
            scrollEnabled={false}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071A24',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    position: 'relative',   
    marginBottom: 24,
  },
  backButton: {
    position: 'absolute', 
    left: 0,              
    padding: 10,          
    zIndex: 1,          
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EFEFEF',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1C3F4F',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a5a75'
  },
  saveButton: {
    backgroundColor: '#00BFA5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 16,
  },
  card: {
    backgroundColor: '#0E2E3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EFEFEF',
    marginBottom: 8,
  },
  text: {
    color: '#B0C4DE',
    fontSize: 14,
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
});