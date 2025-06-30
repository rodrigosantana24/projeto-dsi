import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import {database} from "../configs/firebaseConfig";

const db = database; 
export default async function getUserByEmail(email) {

    const userRef = ref(db, 'usuarios');
    const q = query(userRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(q);

    if (snapshot.exists()) {
        return snapshot.val();
    }
    else{
        throw new Error("Usuário não encontrado");
    }
}
