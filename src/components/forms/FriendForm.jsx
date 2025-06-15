
import { TextInput } from "../inputs/TextInput";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FriendForm({onChange,valueId,onSubmitAdd,onSubmitRemove}){
    return (
       <View style={styles.form}>
            <Text style={styles.formTitle}>Adicione ou Remova um amigo pelo Id</Text>
            <TextInput
                onChangeText={onChange}
                value={valueId}
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={onSubmitAdd}>
                  <Text style={styles.buttonText}>Adicionar Amigo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onSubmitRemove} >
                  <Text style={styles.cancelButtonText}>Remover Amigo</Text>
            </TouchableOpacity>
       </View>
    )
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#243b4a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: "center"
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