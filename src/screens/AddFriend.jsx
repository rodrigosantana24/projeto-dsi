import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../components/navi/HeaderBar';
import SearchGeneric from '../components/search/SearchGeneric';
import { UserContext } from '../Context/UserProvider';
import AmigosService from '../services/AmigosService';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '../components/modal/CustomModal';

const PAGE_SIZE = 20;
const amigoService = new AmigosService();

export default function AddFriend() {
    const { userCredentials } = useContext(UserContext);
    const [search, setSearch] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigation = useNavigation();
    const [showAddModal, setShowAddModal] = useState(false);
    const [amigoParaAdicionar, setAmigoParaAdicionar] = useState(null);


    useEffect(() => {
        carregarUsuarios();
    }, [search]);

    const handleRowOpen = (rowKey, rowMap) => {
        const amigo = usuarios.find(user => user.id === rowKey);
        if (amigo) {
            setAmigoParaAdicionar(amigo);
            setShowAddModal(true);

            // opcional: fecha o swipe visualmente
            if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
            }
        }
    };

    const carregarUsuarios = async () => {
        setLoading(true);
        const usersObj = await handleRead({friendEmail: search});
        if (!usersObj) {
            setUsuarios([]);
            setLoading(false);
            return;
        }
        const usersArr = Object.entries(usersObj).map(([id, data]) => ({
            id,
            ...data
        }));
        setUsuarios(usersArr);
        setLoading(false);
    };

    const handleAdicionar = async({userId, friendEmail}) => {
        try {
            await amigoService.create({userId, friendEmail});
            Toast.show({
                type: 'success',
                text1: 'Amigo adicionado com sucesso!'
            });
            carregarUsuarios();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: error.message || 'Erro ao adicionar amigo'
            });
        }
    };

    const handleRead = async({friendEmail = ""}) => {
        try {
            const users = await amigoService.read({friendEmail});
            return users;
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: error.message || 'Erro ao buscar usuários'
            });
            return null;
        }
    };

    const handleEndReached = () => {
        if ((page * PAGE_SIZE) < usuarios.length) {
            setPage(page + 1);
        }
    };

    const dataToShow = usuarios.slice(0, page * PAGE_SIZE);

    const renderItem = ({ item }) => (
        <View style={styles.rowFront} activeOpacity={0.9}>
            <Text style={styles.nome}>{item.name || 'Sem nome'}</Text>
            <Text style={styles.email}>{item.email}</Text>
        </View>
    
    );

    const renderHiddenItem = ({ item }) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.backRightBtn}
                onPress={() => handleAdicionar({ 
                    userId: userCredentials.uid, 
                    friendEmail: item.email 
                })}
            >
                <MaterialIcons name="person-add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <HeaderBar 
                onBack={() => {
                    navigation.goBack();
                    navigation.replace('FriendList');
                }} 
                title={"Adicionar Amigo"} 
            />
            
            <View style={styles.filterContainer}>
                <View style={styles.searchContainer}>
                    <SearchGeneric
                        placeholder="Pesquisar amigos..."
                        value={search}
                        onSearch={setSearch}
                    />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 30 }} />
            ) : (
                <SwipeListView
                    data={dataToShow}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    previewRowKey={'0'} // opcional
                    previewOpenValue={-75} // pré-visualização do swipe
                    previewOpenDelay={3000}
                    useNativeDriver={false} // ajuda com problemas visuais
                    disableRightSwipe={true}
                    onRowOpen={handleRowOpen}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <Text style={{ color: '#fff', textAlign: 'center', margin: 20 }}>
                            Nenhum usuário encontrado.
                        </Text>
                    }
                    ListFooterComponent={
                        (page * PAGE_SIZE) < usuarios.length
                            ? <Text style={{ color: '#fff', textAlign: 'center', margin: 10 }}>Deslize para carregar mais...</Text>
                            : null
                    }
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddFriend')}
            >
                <MaterialIcons name="add" size={32} color="#fff" />
            </TouchableOpacity>
            <CustomModal
                visible={showAddModal}
                title="Adicionar amigo"
                message={`Deseja realmente adicionar${amigoParaAdicionar ? ` "${amigoParaAdicionar.name}"` : ''} como amigo?`}
                cancelText="Cancelar"
                confirmText="Adicionar"
                onCancel={() => {
                    setShowAddModal(false);
                    setAmigoParaAdicionar(null);
                }}
                onConfirm={async () => {
                    if (!amigoParaAdicionar) return;
                    await handleAdicionar({
                    userId: userCredentials.uid,
                    friendEmail: amigoParaAdicionar.email
                    });
                    setShowAddModal(false);
                    setAmigoParaAdicionar(null);
                }}
                confirmColor="#f4a03f"
                cancelColor="#dc3545"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 25,
        backgroundColor: '#072330',
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    searchContainer: {
        flex: 2,
        marginRight: 8,
    },
    subheader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12,
        marginTop: -4,
        marginLeft: 4,
    },
    visibleContainer: {
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#0a3040',
        padding: 16,
    },
    nome: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        color: '#a0bcc8',
        fontSize: 14,
    },
    hiddenContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        alignItems: 'center',
        backgroundColor: '#072330', 
        paddingRight: 10,
        paddingVertical: 4, 
    },
    addButton: {
        backgroundColor: '#f4a03f',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: '90%', 
        borderRadius: 5, 
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 32,
        backgroundColor: '#f4a03f',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 100,
    },
    backRightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16, 
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%', // pega toda a largura do item
    height: '100%', // pega toda a altura do item
    backgroundColor: '#f4a03f',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    },
    backRightBtnRight: {
        backgroundColor: '#f4a03f',
        right: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8, 
    },
    rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent', 
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden', 
    height: 80,
    },

    rowFront: {
    backgroundColor: '#0a3040',
    borderRadius: 8,
    marginBottom: 10,
    height: 80,
    justifyContent: 'center',
    padding: 16,
    },
});