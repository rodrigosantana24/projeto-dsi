import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

const AddForm = ({ title, poster_path, generos, atores, isEditing, onChange, onSave, onCancel, onOpenModal }) => {
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = true;
    if (!poster_path.trim()) newErrors.poster_path = true;
    if (generos.length === 0) newErrors.generos = true;
    if (atores.length === 0) newErrors.atores = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos',
        text2: 'Por favor, preencha todos os campos destacados.',
        position: 'top',
      });
      return; 
    }

    try {
      await onSave();

      Toast.show({
        type: 'success',
        text1: isEditing ? 'Filme editado com sucesso!' : 'Filme adicionado com sucesso!',
        text2: isEditing ? 'As alterações foram salvas com sucesso.' : 'O novo filme foi adicionado à sua lista.',
        position: 'top',
        visibilityTime: 2000,
        topOffset: 50,
      });
    } catch (error) {
      console.error('Erro ao salvar o filme:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao Salvar',
        text2: 'Não foi possível salvar o filme. Tente novamente.',
        position: 'top',
      });
    }
  };

  return (
    <View style={styles.scrollContent}>
      <View style={styles.headerArea}>
        <Icon name="film" size={40} color="#f4a03f" />
        <Text style={styles.formTitle}>Dados do Filme</Text>
        <Text style={styles.formSubtitle}>
          {isEditing ? 'Altere as informações do filme.' : 'Preencha as informações para cadastrar um novo filme.'}
        </Text>
      </View>

      <View style={styles.inputArea}>
        <Text style={styles.label}>Título do Filme</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="Ex: O Poderoso Chefão"
          placeholderTextColor="#999"
          value={title}
          onChangeText={(text) => {
            onChange('title', text);
            if (errors.title) setErrors((prev) => ({ ...prev, title: false }));
          }}
        />

        <Text style={styles.label}>URL do Poster</Text>
        <TextInput
          style={[styles.input, errors.poster_path && styles.inputError]}
          placeholder="https://.../poster.jpg"
          placeholderTextColor="#999"
          value={poster_path}
          onChangeText={(text) => {
            onChange('poster_path', text);
            if (errors.poster_path) setErrors((prev) => ({ ...prev, poster_path: false }));
          }}
        />

        <Text style={styles.label}>Gêneros</Text>
        <TouchableOpacity
          style={[styles.selectButton, errors.generos && styles.selectButtonError]}
          onPress={() => {
            onOpenModal('generos');
            if (errors.generos) setErrors((prev) => ({ ...prev, generos: false }));
          }}
        >
          <Text style={styles.selectButtonText} numberOfLines={1}>
            {generos.length > 0 ? generos.map(g => g.nome).join(', ') : 'Clique para selecionar'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Atores Principais</Text>
        <TouchableOpacity
          style={[styles.selectButton, errors.atores && styles.selectButtonError]}
          onPress={() => {
            onOpenModal('atores');
            if (errors.atores) setErrors((prev) => ({ ...prev, atores: false }));
          }}
        >
          <Text style={styles.selectButtonText} numberOfLines={1}>
            {atores.length > 0 ? atores.map(a => a.nome).join(', ') : 'Clique para selecionar'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="check" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Icon name="x" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    width: '100%',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  inputArea: {
    width: '100%',
    backgroundColor: '#113342',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  label: {
    color: '#f4a03f',
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3d5564',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    marginBottom: 16,
    backgroundColor: '#18394a',
    fontSize: 16,
    height: 50,
  },
  inputError: {
    borderColor: '#dc3545',
    borderWidth: 1.5,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#3d5564',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#18394a',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonError: {
    borderColor: '#dc3545',
    borderWidth: 1.5,
  },
  selectButtonText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 20,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#f4a03f',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default AddForm;