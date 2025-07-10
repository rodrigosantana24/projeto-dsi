import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Usuario from '../models/Usuario';

export default async function getUser(uid) {
    try {
        const userRef = ref(database, `usuarios/${uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            
            // Normaliza os dados para garantir consistência
            const normalizedData = {
                email: userData.email || '',
                name: userData.name || '',
                amigos: userData.amigos || {},
                favoritos: Array.isArray(userData.favoritos) 
                          ? userData.favoritos.map(String) 
                          : [],
                filmes: Array.isArray(userData.filmes) 
                       ? userData.filmes.map(Number) 
                       : []
            };
            return Usuario.fromFirebase(uid, normalizedData);
        } else {
            console.log("Usuário não encontrado");
            return null;
        }
    } catch (error) {
        console.error("Erro ao carregar o usuário", error);
        return null;
    }
}