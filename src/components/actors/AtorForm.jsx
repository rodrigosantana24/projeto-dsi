import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';

const AtorForm = ({ nome, nacionalidade, sexo, 
                    onChangeNome, onChangeNacionalidade, onChangeSexo,
                    onSubmit, editandoId, title = 'Adicionar Ator', onCancel }) => {
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
      <View style={styles.form}>
        <Text style={styles.formTitle}>{title}</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do Ator"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={onChangeNome}
        />
        <View style={{ position: 'relative' }}>
          <TextInput
            style={styles.input}
            placeholder="Nacionalidade"
            placeholderTextColor="#999"
            value={nacionalidadeInput}
            onChangeText={handleNacionalidadeChange}
            onFocus={() => setShowNacionalidadeOptions(true)}
          />
          {showNacionalidadeOptions && filteredNacionalidadeOptions.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredNacionalidadeOptions}
                keyExtractor={item => item}
                style={{ maxHeight: 150 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleNacionalidadeOptionSelect(item)}
                    style={styles.dropdownOption}
                  >
                    <Text style={styles.dropdownOptionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={styles.input}
            placeholder="Sexo"
            placeholderTextColor="#999"
            value={sexoInput}
            onChangeText={handleSexoChange}
            onFocus={() => setShowOptions(true)}
          />
          {showOptions && filteredOptions.length > 0 && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 100 }}>
                {filteredOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleOptionSelect(option)}
                    style={styles.dropdownOption}
                  >
                    <Text style={styles.dropdownOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (
              sexoOptions.includes(sexoInput) &&
              nacionalidadeOptions.includes(nacionalidadeInput)
            ) {
              onSubmit();
            }
          }}
          disabled={
            !sexoOptions.includes(sexoInput) ||
            !nacionalidadeOptions.includes(nacionalidadeInput)
          }
        >
          <Text style={styles.buttonText}>{editandoId ? 'Atualizar' : 'Salvar'}</Text>
        </TouchableOpacity>
        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#113342',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    zIndex: 20, // <-- Adicione isso
    elevation: 20, // <-- Para Android
  },
  formTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3d5564',
    borderRadius: 6,
    padding: 10,
    color: '#FFF',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#f4a03f',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#e6f2fa',
    borderRadius: 8,
    zIndex: 100, // <-- Aumente aqui
    elevation: 30, // <-- Para Android
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