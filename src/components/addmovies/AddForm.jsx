import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const AddForm = ({ title, poster_path, generos, atores, onChange, onSave, onCancel, onOpenModal }) => {
  return (
    <View style={styles.scrollContent}>
      <View style={styles.headerArea}>
        <Icon name="film" size={40} color="#f4a03f" />
        <Text style={styles.formTitle}>Dados do Filme</Text>
        <Text style={styles.formSubtitle}>
          Preencha as informações para cadastrar um novo filme.
        </Text>
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.label}>Título do Filme</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: O Poderoso Chefão"
          placeholderTextColor="#999"
          value={title}
          onChangeText={(text) => onChange('title', text)}
        />
        <Text style={styles.label}>URL do Poster</Text>
        <TextInput
          style={styles.input}
          placeholder="https://.../poster.jpg"
          placeholderTextColor="#999"
          value={poster_path}
          onChangeText={(text) => onChange('poster_path', text)}
        />

        <Text style={styles.label}>Gêneros</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => onOpenModal('generos')}>
          <Text style={styles.selectButtonText} numberOfLines={1}>
            {generos.length > 0 ? generos.join(', ') : 'Clique para selecionar'}
          </Text>
          <Icon name="tag" size={20} color="#f4a03f" />
        </TouchableOpacity>

        <Text style={styles.label}>Atores Principais</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => onOpenModal('atores')}>
          <Text style={styles.selectButtonText} numberOfLines={1}>
            {atores.length > 0 ? atores.join(', ') : 'Clique para selecionar'}
          </Text>
          <Icon name="users" size={20} color="#f4a03f" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Icon name="x" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
           <Icon name="check" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Salvar</Text>
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
  selectButtonText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#f4a03f',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default AddForm;