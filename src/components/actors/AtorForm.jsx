import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const AtorForm = ({
  nome,
  nacionalidade,
  sexo,
  onChangeNome,
  onChangeNacionalidade,
  onChangeSexo,
  onSubmit,
  editandoId,
  title = 'Adicionar Ator',
  onCancel
}) => {
  const sexoOptions = ['Feminino', 'Masculino'];
  const [showOptions, setShowOptions] = React.useState(false);

  // Nacionalidade
  const nacionalidadeOptions = [
    "Antiguano", "Argentino", "Bahamense", "Barbadiano", "Barbadense", "Belizenho", "Boliviano", "Brasileiro",
    "Chileno", "Colombiano", "Costarriquenho", "Cubano", "Dominicano", "Equatoriano", "Salvadorenho", "Granadino",
    "Guatemalteco", "Guianês", "Guianense", "Haitiano", "Hondurenho", "Jamaicano", "Mexicano", "Nicaraguense",
    "Panamenho", "Paraguaio", "Peruano", "Portorriquenho", "Dominicana", "São-cristovense", "São-vicentino",
    "Santa-lucense", "Surinamês", "Trindadense", "Uruguaio", "Venezuelano", "Alemão", "Austríaco", "Belga",
    "Croata", "Dinamarquês", "Eslovaco", "Esloveno", "Espanhol", "Francês", "Grego", "Húngaro", "Irlandês",
    "Italiano", "Noruego", "Holandês", "Polonês", "Português", "Britânico", "Inglês", "Galês", "Escocês",
    "Romeno", "Russo", "Sérvio", "Sueco", "Suíço", "Turco", "Ucraniano", "Norte-americano", "Canadense", "Angolano",
    "Moçambicano", "Sul-africano", "Zimbabuense", "Argélia", "Comorense", "Egípcio", "Líbio", "Marroquino",
    "Ganés", "Queniano", "Ruandês", "Ugandense", "Bechuano", "Marfinense", "Camaronense", "Nigeriano", "Somali",
    "Australiano", "Neozelandês", "Afegão", "Saudita", "Armeno", "Bangladesh", "Chinês", "Norte-coreano", "Coreano",
    "Sul-coreano", "Indiano", "Indonésio", "Iraquiano", "Iraniano", "Israelita", "Japonês", "Malaio", "Nepalês",
    "Omanense", "Paquistanês", "Palestino", "Qatarense", "Sírio", "Cingalês", "Tailandês", "Timorense", "Maubere",
    "Árabe", "Emiratense", "Vietnamita", "Iemenita"
  ];
  const [nacionalidadeInput, setNacionalidadeInput] = React.useState(nacionalidade || '');
  const [showNacionalidadeOptions, setShowNacionalidadeOptions] = React.useState(false);
  const [nomeError, setNomeError] = React.useState(false);
  const [nacionalidadeError, setNacionalidadeError] = React.useState(false);
  const [sexoError, setSexoError] = React.useState(false);

  React.useEffect(() => {
    setNacionalidadeInput(nacionalidade || '');
  }, [nacionalidade]);

  const filteredNacionalidadeOptions = nacionalidadeOptions.filter(opt =>
    opt.toLowerCase().includes(nacionalidadeInput.toLowerCase())
  );

  const handleNacionalidadeChange = (text) => {
    setNacionalidadeInput(text);
    setShowNacionalidadeOptions(true);
    onChangeNacionalidade(text);
  };

  const handleNacionalidadeOptionSelect = (option) => {
    setNacionalidadeInput(option);
    setShowNacionalidadeOptions(false);
    onChangeNacionalidade(option);
  };

  const validateAndSubmit = () => {
    let hasError = false;
    setNomeError(false);
    setNacionalidadeError(false);
    setSexoError(false);

    if (!nome.trim()) {
      setNomeError(true);
      hasError = true;
    }
    if (!nacionalidadeOptions.includes(nacionalidadeInput)) {
      setNacionalidadeError(true);
      hasError = true;
    }
    if (!sexoOptions.includes(sexo)) {
      setSexoError(true);
      hasError = true;
    }

    if (hasError) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos',
      });
      return;
    }
    onSubmit();
  };

  // Função para esconder dropdowns ao clicar fora
  const dismissDropdowns = () => {
    setShowOptions(false);
    setShowNacionalidadeOptions(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissDropdowns}>
      <View style={styles.fullScreenContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerArea}>
            <MaterialIcons name={editandoId ? "edit" : "person-add"} size={40} color="#f4a03f" />
            <Text style={styles.formTitle}>{title}</Text>
            <Text style={styles.formSubtitle}>
              {editandoId
                ? "Atualize as informações do ator selecionado."
                : "Preencha os dados para cadastrar um novo ator."}
            </Text>
          </View>

          <View style={styles.inputArea}>
            {/* Nome */}
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={[styles.input, nomeError && styles.inputError]}
              placeholder="Tom Cruise"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={text => {
                setNomeError(false);
                onChangeNome(text);
              }}
              maxLength={40}
            />

            {/* Nacionalidade */}
            <Text style={styles.label}>Nacionalidade</Text>
            <View style={{ position: 'relative', zIndex: showNacionalidadeOptions ? 20 : 1 }}>
              <TextInput
                style={[styles.input, nacionalidadeError && styles.inputError]}
                placeholder="Norte-americano"
                placeholderTextColor="#999"
                value={nacionalidadeInput}
                onChangeText={handleNacionalidadeChange}
                onFocus={() => {
                  setShowNacionalidadeOptions(true);
                  setShowOptions(false);
                  setNacionalidadeError(false);
                }}
                maxLength={30}
              />
              {showNacionalidadeOptions &&
                nacionalidadeInput.length > 0 &&
                filteredNacionalidadeOptions.length > 0 && (
                  <View style={styles.dropdown}>
                    <View style={{ maxHeight: 180 }}>
                      {filteredNacionalidadeOptions.map(item => (
                        <TouchableOpacity
                          key={item}
                          style={styles.dropdownOption}
                          onPress={() => handleNacionalidadeOptionSelect(item)}
                        >
                          <Text style={styles.dropdownOptionText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
            </View>

            {/* Sexo */}
            <Text style={styles.label}>Sexo</Text>
            <View style={{ position: 'relative', zIndex: showOptions ? 20 : 1 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setShowOptions(!showOptions);
                  setShowNacionalidadeOptions(false);
                  setSexoError(false);
                }}
              >
                <View pointerEvents="none">
                  <TextInput
                    style={[styles.input, sexoError && styles.inputError]}
                    placeholder="Selecione"
                    placeholderTextColor="#999"
                    value={sexo}
                    editable={false}
                  />
                </View>
              </TouchableOpacity>
              {showOptions && (
                <View style={styles.dropdown}>
                  {sexoOptions.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        setShowOptions(false);
                        onChangeSexo(option);
                      }}
                      style={styles.dropdownOption}
                    >
                      <Text style={styles.dropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Botão de salvar */}
          <TouchableOpacity
            style={[
              styles.button,
              // Remova a lógica de desabilitar cor
            ]}
            onPress={validateAndSubmit}
          >
            <MaterialIcons name={editandoId ? "save" : "check"} size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>{editandoId ? 'Atualizar' : 'Salvar'}</Text>
          </TouchableOpacity>

          {onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <MaterialIcons name="cancel" size={22} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const { width } = Dimensions.get('window');

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
    width: width-30,
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
    zIndex: 10,
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
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 10,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3d5564',
    borderRadius: 4,
    padding: 12,
    color: '#FFF',
    marginBottom: 6,
    backgroundColor: '#18394a',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#dc3545',
    backgroundColor: '#2a1a1a',
  },
  button: {
    zIndex: 1,
    backgroundColor: '#f4a03f',
    padding: 14,
    borderRadius: 4,
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
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  cancelButton: {
    zIndex: 1,
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#e6f2fa',
    borderRadius: 4,
    zIndex: 9999, // aumente aqui
    elevation: 30,
    borderWidth: 1,
    borderColor: '#3d5564',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d5564', 
    backgroundColor: '#397391',   
    justifyContent: 'center',
  },
  dropdownOptionText: {
    color: '#FFFFFF',  
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AtorForm;