import { View, Text , StyleSheet, Alert} from 'react-native';
import FriendForm from '../components/forms/FriendForm';
import { UserContext } from '../Context/UserProvider';
import AmigosService from '../services/AmigosService';
import { useContext, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/navi/HeaderBar';
import { TextInput } from '../components/inputs/TextInput';
import { FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import getFriendFilter from '../services/getFriendsFilter';
const amigoService = new AmigosService();

const handleAdicionar = async({userId, friendEmail}) =>{
    try {
        await amigoService.create({userId : userId , friendEmail : friendEmail})
        Alert.alert("Amigo adicionado com sucesso!");
    } catch (error) {
        console.log("Erro ao adicionar");
        Alert.alert(error.message || "Erro ao adicionar amigo");
    } 
}
const handleRemover = async({userId, friendEmail}) =>{
        try {
            await amigoService.delete({userId : userId , friendEmail : friendEmail})
            Alert.alert("Amigo removido com sucesso!");
        } catch (error) {
            Alert.alert(error.message || "Erro ao remover amigo");
        }
    }
const handleRead = async({friendEmail = ""}) => {
    try {
        const users = await amigoService.read({friendEmail});
        return users;
    } catch (error) {
        console.log("Erro ao buscar usuários");
        Alert.alert(error.message || "Erro ao buscar usuários");
    }
}

const handleUpdate = async({userId, friendEmail, nickName}) => {
    try {
        await amigoService.update({userId : userId , nickName: nickName , friendEmail : friendEmail})
        Alert.alert("Amigo atualizado com sucesso!");
    } catch (error) {
        console.log("Erro ao atualizar");
        Alert.alert(error.message || "Erro ao atualizar amigo");
    }
}

export default function AddFriend() {
    const { userCredentials } = useContext(UserContext);
    const [search, setSearch] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        carregarUsuarios();
    }, [search]);

    const carregarUsuarios = async () => {
        setLoading(true);
        const usersObj = await handleRead({friendEmail: search});
        // usersObj pode ser undefined se der erro
        if (!usersObj) {
            setUsuarios([]);
            setLoading(false);
            return;
        }
        // Transformar objeto em array
        const usersArr = Object.entries(usersObj).map(([id, data]) => ({
            id,
            ...data
        }));
        setUsuarios(usersArr);
        setLoading(false);
    };

    // Filtro usando getFriendFilter
    

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.nome}>{item.name || 'Sem nome'}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <View style={styles.botoes}>
                <TouchableOpacity
                    style={[styles.botao, styles.adicionar]}
                    onPress={() => handleAdicionar({ userId: userCredentials.uid, friendEmail: item.email })}
                >
                    <Text style={styles.botaoTexto}>Adicionar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.botao, styles.remover]}
                    onPress={() => handleRemover({ userId: userCredentials.uid, friendEmail: item.email })}
                >
                    <Text style={styles.botaoTexto}>Remover</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <HeaderBar onBack={() => navigation.goBack()} title={"Adicionar Amigo"} />
            <TextInput
                placeholder="Pesquisar por Email"
                value={search}
                onChangeText={setSearch}
                style={styles.searchBar}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 30 }} />
            ) : (
                <FlatList
                    data={usuarios}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <Text style={{ color: '#FFF', textAlign: 'center', marginTop: 30 }}>
                            Nenhum usuário encontrado.
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 25,
    backgroundColor: '#072330', // Fundo escuro elegante
  },

  searchBar: {
    backgroundColor: '#0e3a4d',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#0e3a4d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  nome: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  email: {
    color: '#b0c4de',
    fontSize: 14,
    marginBottom: 12,
  },

  botoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },

  botao: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginLeft: 8,
  },

  botaoTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  adicionar: {
    backgroundColor: '#2ecc40',
  },

  remover: {
    backgroundColor: '#e74c3c',
  },

  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    marginTop: -4,
    marginLeft: 4,
  },

  loading: {
    marginTop: 30,
  },

  emptyText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
});
