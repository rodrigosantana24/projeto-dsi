import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const GeneroForm = ({
  nome,
  descricao,
  onChangeNome,
  onChangeDescricao,
  onSubmit,
  editandoId,
  title = 'Adicionar Gênero',
  onCancel
}) => {
  const dismissKeyboard = () => Keyboard.dismiss();

  const [nomeError, setNomeError] = React.useState(false);
  const [descricaoError, setDescricaoError] = React.useState(false);

  const validateAndSubmit = () => {
    let hasError = false;
    setNomeError(false);
    setDescricaoError(false);

    if (!nome.trim()) {
      setNomeError(true);
      hasError = true;
    }

    if (!descricao.trim()) {
      setDescricaoError(true);
      hasError = true;
    }

    if (hasError) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos corretamente',
      });
      return;
    }

    onSubmit();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.fullScreenContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerArea}>
            <MaterialIcons name={editandoId ? 'edit' : 'playlist-add'} size={40} color="#f4a03f" />
            <Text style={styles.formTitle}>{title}</Text>
            <Text style={styles.formSubtitle}>
              {editandoId
                ? 'Atualize os dados do gênero selecionado.'
                : 'Preencha os dados para cadastrar um novo gênero.'}
            </Text>
          </View>

          <View style={styles.inputArea}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={[styles.input, nomeError && styles.inputError]}
              placeholder="Nome do Gênero"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={(text) => {
                setNomeError(false);
                onChangeNome(text);
              }}
              maxLength={40}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, descricaoError && styles.inputError]}
              placeholder="Descrição do Gênero"
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={(text) => {
                setDescricaoError(false);
                onChangeDescricao(text);
              }}
              maxLength={80}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={validateAndSubmit}>
            <MaterialIcons name={editandoId ? 'save' : 'check'} size={22} color="#fff" style={{ marginRight: 8 }} />
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
    width: width - 30
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
  inputError: {
    borderColor: '#dc3545',
    backgroundColor: '#2a1a1a',
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
});

export default GeneroForm;