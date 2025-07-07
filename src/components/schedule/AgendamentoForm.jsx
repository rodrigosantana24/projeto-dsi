import React, { useState, useEffect, useRef } from 'react'; // Importar useRef
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
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
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

  // NOVO: Usaremos um useRef para evitar re-renderizações desnecessárias ao mudar isSelectingFilm
  // e para ter uma referência mutável que não aciona useEffects
  const isSelectingFilmRef = useRef(false);

  useEffect(() => {
    // Se o texto de busca está vazio, não precisamos buscar nada
    if (!buscaFilme.trim()) {
      setFilmesFiltrados([]);
      setFilmesPagina([]);
      setPaginaAtual(0);
      setDropdownVisible(false);
      return;
    }

    // Se estivermos em um processo de seleção programática, não execute a busca
    if (isSelectingFilmRef.current) {
      return;
    }

    // Caso contrário, inicie a busca após um pequeno debounce para evitar muitas chamadas
    const handler = setTimeout(() => {
      buscarFilmes();
    }, 300); // Adicionado debounce para melhorar performance

    return () => {
      clearTimeout(handler);
    };
  }, [buscaFilme]); // Removido isSelectingFilm das dependências, pois usamos a ref

  useEffect(() => {
    // Quando um filme é pré-selecionado (ex: em modo de edição),
    // o campo de busca deve refletir o título.
    // Usamos isSelectingFilmRef.current para evitar looping quando setBuscaFilme é chamado em selecionarFilme
    if (filmeSelecionado?.title && buscaFilme === '' && !isSelectingFilmRef.current) {
      setBuscaFilme(filmeSelecionado.title);
      setFilmeError(false);
    } else if (!filmeSelecionado?.title && buscaFilme !== '' && !isSelectingFilmRef.current) {
      // Se o filme selecionado for limpo mas o campo de busca tem algo,
      // limpar o campo de busca também para evitar inconsistência.
      // E só limpe se não estivermos selecionando programaticamente.
      setBuscaFilme('');
    }
  }, [filmeSelecionado]);


  const buscarFilmes = async () => {
    setBuscandoFilmes(true);
    try {
      const todos = await Filme.getFilmesFirebaseFiltrados(buscaFilme.trim());
      setFilmesFiltrados(todos);
      setFilmesPagina(todos.slice(0, PAGE_SIZE));
      // Só mostre o dropdown se houver resultados E se o campo de busca não estiver vazio
      // e se o filme selecionado atual não corresponder perfeitamente ao que já está no campo de busca
      const isAlreadySelected = filmeSelecionado?.title === buscaFilme && filmesFiltrados.some(f => f.id === filmeSelecionado.id);
      if (todos.length > 0 && buscaFilme.trim().length > 0 && !isAlreadySelected) {
        setDropdownVisible(true);
      } else {
        setDropdownVisible(false);
      }
      setPaginaAtual(1);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      setDropdownVisible(false); // Fechar dropdown em caso de erro
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
    isSelectingFilmRef.current = true; // Seta a ref para true ANTES de mudar o estado
    onChangeFilmeSelecionado({ id: filme.id, title: filme.title });
    setBuscaFilme(filme.title);
    setFilmesFiltrados([]); // Limpa os filmes filtrados para não exibir sugestões antigas
    setFilmesPagina([]); // Limpa a página de filmes também
    setDropdownVisible(false);
    Keyboard.dismiss();
    setFilmeError(false);

    // Resetar isSelectingFilmRef.current para false APÓS um pequeno atraso
    // Isso é crucial para que futuras digitações voltem a disparar a busca
    setTimeout(() => {
      isSelectingFilmRef.current = false;
    }, 200); // Pequeno atraso para garantir que o ciclo de renderização termine
  };

  const validateAndSubmit = () => {
    let hasError = false;
    setFilmeError(false);
    setDataError(false);
    setHoraError(false);

    if (!filmeSelecionado?.id) {
      setFilmeError(true);
      hasError = true;
    }
    if (!data.trim()) {
      setDataError(true);
      hasError = true;
    }
    if (!hora.trim()) {
      setHoraError(true);
      hasError = true;
    }

    if (hasError) {
      Toast.show({
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
    // Ajustar o campo de busca se nenhum filme válido foi selecionado ou se o texto está incorreto
    if (!filmeSelecionado?.id) {
        setBuscaFilme(''); // Limpa o campo se nada foi selecionado
    } else if (buscaFilme !== filmeSelecionado.title) {
        setBuscaFilme(filmeSelecionado.title); // Restaura o título do filme selecionado
    }
  };


  const formatarData = (text) => {
    let cleanedText = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleanedText.length > 0) {
      formattedText = cleanedText.substring(0, 2);
      if (cleanedText.length >= 3) {
        formattedText += '/' + cleanedText.substring(2, 4);
      }
      if (cleanedText.length >= 5) {
        formattedText += '/' + cleanedText.substring(4, 8);
      }
    }
    setDataError(false);
    onChangeData(formattedText);
  };

  const formatarHora = (text) => {
    let cleanedText = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleanedText.length > 0) {
      formattedText = cleanedText.substring(0, 2);
      if (cleanedText.length >= 3) {
        formattedText += ':' + cleanedText.substring(2, 4);
      }
    }
    setHoraError(false);
    onChangeHora(formattedText);
  };

  return (
    <KeyboardAvoidingView
      style={styles.fullScreenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={dismissDropdown}>
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
                style={[styles.input, filmeError && styles.inputError]}
                placeholder="Digite ou selecione o filme"
                placeholderTextColor="#999"
                value={buscaFilme}
                onChangeText={(text) => {
                  setBuscaFilme(text);
                  // Sempre que o usuário digita, queremos o dropdown visível
                  setDropdownVisible(true);
                  // Se o usuário está digitando novamente, desmarque o filme selecionado
                  // Isso garante que a validação funcione corretamente se ele não selecionar
                  // um item da lista.
                  if (filmeSelecionado?.id && text !== filmeSelecionado.title) {
                      onChangeFilmeSelecionado(null);
                  }
                }}
                onFocus={() => {
                    setFilmeError(false);
                    // Se há um filme selecionado, e o campo de busca já contém o título dele,
                    // não limpe o campo e não mude a visibilidade do dropdown.
                    // Isso permite que o usuário veja o filme já selecionado e digite para buscar outro.
                    if (filmeSelecionado?.id && buscaFilme === filmeSelecionado.title) {
                        // Não faça nada ou reabra o dropdown se quiser que ele veja as sugestões para o título atual
                        setDropdownVisible(true); // Opcional: manter o dropdown aberto ao focar
                    } else {
                        // Caso contrário, limpe o campo para uma nova busca
                        setBuscaFilme('');
                        onChangeFilmeSelecionado(null);
                        setDropdownVisible(true); // Abre o dropdown para nova busca
                    }
                }}
                maxLength={100}
              />

              {/* Condição para mostrar o dropdown: Visível E houver filmes na página */}
              {dropdownVisible && filmesPagina.length > 0 && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
                    {buscandoFilmes ? ( // Adicionado indicador de carregamento
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#f4a03f" />
                        <Text style={styles.loadingText}>Buscando filmes...</Text>
                      </View>
                    ) : (
                      filmesPagina.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownOption}
                          onPress={() => selecionarFilme(item)}
                        >
                          <Text style={styles.dropdownOptionText}>{item.title}</Text>
                        </TouchableOpacity>
                      ))
                    )}

                    {filmesPagina.length < filmesFiltrados.length && !buscandoFilmes && (
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

            <Text style={styles.label}>Data (DD/MM/AAAA)</Text>
            <TextInput
              style={[styles.input, dataError && styles.inputError]}
              placeholder="Ex: 25/12/2025"
              placeholderTextColor="#999"
              value={data}
              onChangeText={formatarData}
              maxLength={10}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Hora (HH:mm)</Text>
            <TextInput
              style={[styles.input, horaError && styles.inputError]}
              placeholder="Ex: 14:30"
              placeholderTextColor="#999"
              value={hora}
              onChangeText={formatarHora}
              maxLength={5}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={validateAndSubmit}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    borderColor: '#dc3545',
    backgroundColor: '#2a1a1a',
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
  loadingContainer: { // Novo estilo para o indicador de carregamento
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { // Novo estilo para o texto do carregamento
    color: '#fff',
    marginLeft: 10,
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