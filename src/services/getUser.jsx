import { getDatabase, ref, get } from 'firebase/database';
import {database} from "../configs/firebaseConfig";


const db = database
export default async function getUser(uid) {
    try {
        const userRef = ref(db, `usuarios/${uid}`);
        const snapshot = await get(userRef);
        const usuario = snapshot.val();
        return usuario;
    } catch (error) {
        console.error("Erro ao carregar o usuario", error);
        return null;
    }
}