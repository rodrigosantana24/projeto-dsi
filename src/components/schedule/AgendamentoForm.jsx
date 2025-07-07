import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message'; // Adicionado: Importação do Toast
import Filme from '../../models/Filme';

const PAGE_SIZE = 20;
const { width } = Dimensions.get('window');

const AgendamentoForm = ({
  filmeSelecionado,
  onChangeFilmeSelecionado,
  data,
  onChangeData,
  hora,
  onChangeHora,
  onSubmit,
  onCancel,
  editando,
}) => {
  const [buscaFilme, setBuscaFilme] = useState('');
  const [filmesFiltrados, setFilmesFiltrados] = useState([]);
  const [filmesPagina, setFilmesPagina] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [buscandoFilmes, setBuscandoFilmes] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filmeError, setFilmeError] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [horaError, setHoraError] = useState(false);

  useEffect(() => {
    if (!buscaFilme.trim()) {
      setFilmesFiltrados([]);
      setFilmesPagina([]);
      setPaginaAtual(0);
      setDropdownVisible(false);
      return;
    }
    buscarFilmes();
  }, [buscaFilme]);

  useEffect(() => {
    if (filmeSelecionado?.title) {
      // Limpa o erro do filme quando um filme é selecionado
      setFilmeError(false);
    }
  }, [filmeSelecionado]);

  const buscarFilmes = async () => {
    setBuscandoFilmes(true);
    try {
      const todos = await Filme.getFilmesFirebaseFiltrados(buscaFilme.trim());
      setFilmesFiltrados(todos);
      setFilmesPagina(todos.slice(0, PAGE_SIZE));
      setPaginaAtual(1);
      setDropdownVisible(true);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setBuscandoFilmes(false);
    }
  };

  const carregarMaisFilmes = () => {
    if (buscandoFilmes) return;
    const inicio = paginaAtual * PAGE_SIZE;
    const fim = inicio + PAGE_SIZE;
    const mais = filmesFiltrados.slice(inicio, fim);
    if (mais.length === 0) return;
    setFilmesPagina(prev => [...prev, ...mais]);
    setPaginaAtual(paginaAtual + 1);
  };

  const selecionarFilme = (filme) => {
    onChangeFilmeSelecionado({ id: filme.id, title: filme.title });
    setBuscaFilme('');
    setFilmesFiltrados([]);
    setFilmesPagina([]);
    setDropdownVisible(false);
    Keyboard.dismiss();
    setFilmeError(false); // Limpa o erro ao selecionar um filme
  };

  const validateAndSubmit = () => {
    let hasError = false;
    setFilmeError(false); // Reinicia o estado de erro do filme
    setDataError(false); // Reinicia o estado de erro da data
    setHoraError(false); // Reinicia o estado de erro da hora

    if (!filmeSelecionado?.id) { // Verifica se um filme foi selecionado
      setFilmeError(true); // Define o erro para filme
      hasError = true;
    }
    if (!data.trim()) { // Verifica se a data está vazia
      setDataError(true); // Define o erro para data
      hasError = true;
    }
    if (!hora.trim()) { // Verifica se a hora está vazia
      setHoraError(true); // Define o erro para hora
      hasError = true;
    }

    if (hasError) {
      Toast.show({ // Mostra o Toast de erro
        type: 'error',
        text1: 'Preencha todos os campos obrigatórios.',
      });
      return;
    }
    onSubmit();
  };

  const dismissDropdown = () => {
    setDropdownVisible(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissDropdown}>
      <View style={styles.fullScreenContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerArea}>
            <MaterialIcons
              name={editando ? 'edit' : 'add-circle-outline'}
              size={40}
              color="#f4a03f"
            />
            <Text style={styles.formTitle}>
              {editando ? 'Editar Agendamento' : 'Novo Agendamento'}
            </Text>
            <Text style={styles.formSubtitle}>
              {editando
                ? 'Atualize as informações do agendamento.'
                : 'Preencha os dados para criar um novo agendamento.'}
            </Text>
          </View>

          <View style={styles.inputArea}>

            <Text style={styles.label}>Buscar Filme</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={styles.input}
                placeholder="Digite o título do filme"
                placeholderTextColor="#999"
                value={buscaFilme}
                onChangeText={setBuscaFilme}
                onFocus={() => {
                  setDropdownVisible(true);
                  // Limpar o erro do filme ao focar na busca (já estava aqui)
                  setFilmeError(false);
                }}
                maxLength={100}
              />

              {dropdownVisible && filmesPagina.length > 0 && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
                    {filmesPagina.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownOption}
                        onPress={() => selecionarFilme(item)}
                      >
                        <Text style={styles.dropdownOptionText}>{item.title}</Text>
                      </TouchableOpacity>
                    ))}

                    {filmesPagina.length < filmesFiltrados.length && (
                      <TouchableOpacity
                        style={[styles.dropdownOption, { backgroundColor: '#f4a03f' }]}
                        onPress={carregarMaisFilmes}
                      >
                        <Text style={[styles.dropdownOptionText, { color: '#072330' }]}>
                          Carregar mais...
                        </Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={styles.label}>Filme Selecionado</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#445a72' }, filmeError && styles.inputError]} // Aplica estilo de erro se filmeError for true
              placeholder="Nenhum filme selecionado"
              placeholderTextColor="#999"
              value={filmeSelecionado?.title || ''}
              editable={false}
            />

            <Text style={styles.label}>Data (DD/MM/AAAA)</Text>
            <TextInput
              style={[styles.input, dataError && styles.inputError]} // Aplica estilo de erro se dataError for true
              placeholder="Ex: 25/12/2025"
              placeholderTextColor="#999"
              value={data}
              onChangeText={text => {
                setDataError(false); // Limpa o erro ao digitar
                onChangeData(text);
              }}
              maxLength={10}
            />

            <Text style={styles.label}>Hora (HH:mm)</Text>
            <TextInput
              style={[styles.input, horaError && styles.inputError]} // Aplica estilo de erro se horaError for true
              placeholder="Ex: 14:30"
              placeholderTextColor="#999"
              value={hora}
              onChangeText={text => {
                setHoraError(false); // Limpa o erro ao digitar
                onChangeHora(text);
              }}
              maxLength={5}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={validateAndSubmit} // Corrigido: Agora chama validateAndSubmit
          >
            <MaterialIcons
              name={editando ? 'save' : 'check'}
              size={22}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>{editando ? 'Atualizar' : 'Salvar'}</Text>
          </TouchableOpacity>

          {onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <MaterialIcons
                name="cancel"
                size={22}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#072330',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
    width: width - 20,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  inputError: {
    borderColor: '#dc3545', // Cor da borda: vermelho
    backgroundColor: '#2a1a1a', // Cor do fundo: um tom mais escuro de vermelho/marrom
  },
  formTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 1,
  },
  formSubtitle: {
    color: '#f4a03f',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    maxWidth: 320,
  },
  inputArea: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
    backgroundColor: '#113342',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 14,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3d5564',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    backgroundColor: '#18394a',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#113342',
    borderRadius: 12,
    zIndex: 100,
    elevation: 30,
    borderWidth: 1,
    borderColor: '#3d5564',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    maxHeight: 150,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d5564',
    backgroundColor: '#18394a',
    justifyContent: 'center',
  },
  dropdownOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#f4a03f',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 8,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#bfa07a',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});

export default AgendamentoForm;