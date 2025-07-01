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
  };

  const isFormValid = () =>
    filmeSelecionado?.id && data.trim() && hora.trim();

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
                onFocus={() => setDropdownVisible(true)}
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
              style={[styles.input, { backgroundColor: '#445a72' }]}
              placeholder="Nenhum filme selecionado"
              placeholderTextColor="#999"
              value={filmeSelecionado?.title || ''}
              editable={false}
            />

            <Text style={styles.label}>Data (DD/MM/AAAA)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 25/12/2025"
              placeholderTextColor="#999"
              value={data}
              onChangeText={onChangeData}
              maxLength={10}
            />

            <Text style={styles.label}>Hora (HH:mm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 14:30"
              placeholderTextColor="#999"
              value={hora}
              onChangeText={onChangeHora}
              maxLength={5}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !isFormValid() ? styles.buttonDisabled : null]}
            onPress={onSubmit}
            disabled={!isFormValid()}
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
    color: '#f4a03f',
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
    color: '#f4a03f',  
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
