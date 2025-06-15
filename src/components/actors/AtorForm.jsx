import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const AtorForm = ({ nome, nacionalidade, sexo, 
                    onChangeNome, onChangeNacionalidade, onChangeSexo,
                    onSubmit, editandoId, title = 'Adicionar Ator', onCancel }) => {
  const [sexoInput, setSexoInput] = React.useState(sexo || '');

  React.useEffect(() => {
    setSexoInput(sexo || '');
  }, [sexo]);

  const handleSexoChange = (text) => {
    setSexoInput(text);
    onChangeSexo(text);
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>{title}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Ator"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={onChangeNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Nacionalidade"
        placeholderTextColor="#999"
        value={nacionalidade}
        onChangeText={onChangeNacionalidade}
      />
      <View>
        <TextInput
          style={styles.input}
          placeholder="Sexo"
          placeholderTextColor="#999"
          value={sexoInput}
          onChangeText={handleSexoChange}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onSubmit}
        disabled={false}
      >
        <Text style={styles.buttonText}>{editandoId ? 'Atualizar' : 'Salvar'}</Text>
      </TouchableOpacity>
      {onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#113342',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
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
    backgroundColor: '#1abc9c',
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
});

export default AtorForm;