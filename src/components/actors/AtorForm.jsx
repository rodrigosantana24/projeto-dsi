import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
  const [sexoInput, setSexoInput] = React.useState(sexo || '');
  const [showOptions, setShowOptions] = React.useState(false);

  React.useEffect(() => {
    setSexoInput(sexo || '');
  }, [sexo]);

  const filteredOptions = sexoOptions.filter(opt =>
    opt.toLowerCase().includes(sexoInput.toLowerCase())
  );

  const handleSexoChange = (text) => {
    setSexoInput(text);
    setShowOptions(true);
    onChangeSexo(text);
  };

  const handleOptionSelect = (option) => {
    setSexoInput(option);
    setShowOptions(false);
    onChangeSexo(option);
  };

  const nacionalidadeOptions = [
    "Antiguano", "Argentino", "Bahamense", "Barbadiano", "Barbadense", "Belizenho", "Boliviano", "Brasileiro",
    "Chileno", "Colombiano", "Costarriquenho", "Cubano", "Dominicano", "Equatoriano", "Salvadorenho", "Granadino",
    "Guatemalteco", "Guianês", "Guianense", "Haitiano", "Hondurenho", "Jamaicano", "Mexicano", "Nicaraguense",
    "Panamenho", "Paraguaio", "Peruano", "Portorriquenho", "Dominicana", "São-cristovense", "São-vicentino",
    "Santa-lucense", "Surinamês", "Trindadense", "Uruguaio", "Venezuelano", "Alemão", "Austríaco", "Belga",
    "Croata", "Dinamarquês", "Eslovaco", "Esloveno", "Espanhol", "Francês", "Grego", "Húngaro", "Irlandês",
    "Italiano", "Noruego", "Holandês", "Polonês", "Português", "Britânico", "Inglês", "Galês", "Escocês",
    "Romeno", "Russo", "Sérvio", "Sueco", "Suíço", "Turco", "Ucraniano", "Americano", "Canadense", "Angolano",
    "Moçambicano", "Sul-africano", "Zimbabuense", "Argélia", "Comorense", "Egípcio", "Líbio", "Marroquino",
    "Ganés", "Queniano", "Ruandês", "Ugandense", "Bechuano", "Marfinense", "Camaronense", "Nigeriano", "Somali",
    "Australiano", "Neozelandês", "Afegão", "Saudita", "Armeno", "Bangladesh", "Chinês", "Norte-coreano", "Coreano",
    "Sul-coreano", "Indiano", "Indonésio", "Iraquiano", "Iraniano", "Israelita", "Japonês", "Malaio", "Nepalês",
    "Omanense", "Paquistanês", "Palestino", "Qatarense", "Sírio", "Cingalês", "Tailandês", "Timorense", "Maubere",
    "Árabe", "Emiratense", "Vietnamita", "Iemenita"
  ];

  const [nacionalidadeInput, setNacionalidadeInput] = React.useState(nacionalidade || '');
  const [showNacionalidadeOptions, setShowNacionalidadeOptions] = React.useState(false);

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
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Ator"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={onChangeNome}
              maxLength={40}
            />

            <Text style={styles.label}>Nacionalidade</Text>
            <View style={[{ position: 'relative' }, showNacionalidadeOptions ? { zIndex: 10 } : { zIndex: 1 }]}>
              <TextInput
                style={styles.input}
                placeholder="Nacionalidade"
                placeholderTextColor="#999"
                value={nacionalidadeInput}
                onChangeText={handleNacionalidadeChange}
                onFocus={() => {
                  setShowNacionalidadeOptions(true);
                  setShowOptions(false);
                }}
                maxLength={30}
              />
              {showNacionalidadeOptions &&
                nacionalidadeInput.length > 0 &&
                filteredNacionalidadeOptions.length > 0 && (
                  <View style={styles.dropdown}>
                    <View style={{ maxHeight: 150, overflow: 'scroll' }}>
                      {filteredNacionalidadeOptions.slice(0, 10).map(item => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => handleNacionalidadeOptionSelect(item)}
                          style={styles.dropdownOption}
                        >
                          <Text style={styles.dropdownOptionText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
            </View>

            <Text style={styles.label}>Sexo</Text>
            <View style={[{ position: 'relative' }, showOptions ? { zIndex: 10 } : { zIndex: 1 }]}>
              <TextInput
                style={styles.input}
                placeholder="Sexo"
                placeholderTextColor="#999"
                value={sexoInput}
                onChangeText={handleSexoChange}
                onFocus={() => {
                  setShowOptions(true);
                  setShowNacionalidadeOptions(false);
                }}
                maxLength={10}
              />
              {showOptions &&
                sexoInput.length > 0 &&
                filteredOptions.length > 0 && (
                  <View style={styles.dropdown}>
                    <View style={{ maxHeight: 100, overflow: 'scroll' }}>
                      {filteredOptions.map(option => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => handleOptionSelect(option)}
                          style={styles.dropdownOption}
                        >
                          <Text style={styles.dropdownOptionText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (!sexoOptions.includes(sexoInput) ||
                !nacionalidadeOptions.includes(nacionalidadeInput) ||
                !nome.trim())
                ? styles.buttonDisabled
                : null,
            ]}
            onPress={() => {
              if (
                sexoOptions.includes(sexoInput) &&
                nacionalidadeOptions.includes(nacionalidadeInput) &&
                nome.trim()
              ) {
                onSubmit();
              }
            }}
            disabled={
              !sexoOptions.includes(sexoInput) ||
              !nacionalidadeOptions.includes(nacionalidadeInput) ||
              !nome.trim()
            }
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
    width: width-20,
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
    marginBottom: 4,
    marginTop: 10,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3d5564',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    marginBottom: 6,
    backgroundColor: '#18394a',
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
    color: '#FFF',
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
    borderRadius: 8,
    zIndex: 100,
    elevation: 30,
    borderWidth: 1,
    borderColor: '#3d5564',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cce0ee',
    backgroundColor: '#d6eaff',
    borderRadius: 6,
    margin: 4,
    alignItems: 'center',
  },
  dropdownOptionText: {
    color: '#113342',
    fontWeight: 'bold',
  },
});

export default AtorForm;