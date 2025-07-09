import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { database } from "../configs/firebaseConfig";
import Usuario from "../models/Usuario";
export default async function getUserByEmail(email) {
    try {
        const userRef = ref(database, 'usuarios');
        const q = query(userRef, orderByChild('email'), equalTo(email));
        const snapshot = await get(q);

        if (snapshot.exists()) {
            // Obtém o primeiro usuário encontrado (deveria ser único se email for único)
            const userData = snapshot.val();
            const userId = Object.keys(userData)[0]; // Pega o primeiro/único ID
            const user = userData[userId];
            
            // Normaliza os dados para garantir consistência
            const normalizedData = {
                email: user.email || '',
                name: user.name || '',
                amigos: user.amigos || {},
                favoritos: Array.isArray(user.favoritos) 
                          ? user.favoritos.map(String) 
                          : [],
                filmes: Array.isArray(user.filmes) 
                       ? user.filmes.map(Number) 
                       : []
            };
            
            return Usuario.fromFirebase(userId, normalizedData);
        } else {
            throw new Error("Usuário não encontrado");
        }
    } catch (error) {
        console.error("Erro ao buscar usuário por email:", error);
        throw error; // Propaga o erro para quem chamou a função
    }
}