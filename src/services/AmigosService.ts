import { getDatabase, ref, set,get, remove,update, limitToFirst, query ,orderByChild, startAt , endAt } from "firebase/database";
import ICrud from "./ICrud";
import getUserByEmail from "./getUserByEmail";


interface FriendParams {
  userId: string;
  friendEmail: string;
  nickName?: string; 
  friendId?: string;
  name?: string;
}

interface FriendReadParams {
  name?: string;
  friendEmail?: string;
}
export default class AmigosService implements ICrud<FriendParams, never, never, FriendParams> {

  async create({ userId, friendEmail }: FriendParams): Promise<void> {
    const db = getDatabase();

    try {
      const user = await getUserByEmail(friendEmail);
      
      if (!user || Object.keys(user).length === 0) {
        throw new Error("Usuário não encontrado.");
      }
      const idFriend = Object.keys(user)[0];
      const amigoRef = ref(db, `/usuarios/${userId}/amigos/${idFriend}`);
      await set(amigoRef, {
        amigo_id: idFriend
      });
    } catch (error: any) {
      throw new Error(error.message || "Erro ao adicionar amigo.");
    }
  }

  async delete({ userId, friendEmail }: FriendParams): Promise<void> {
    const db = getDatabase();

    try {
      const user = await getUserByEmail(friendEmail);
      const idFriend = Object.keys(user)[0];
      const amigoRef = ref(db, `/usuarios/${userId}/amigos/${idFriend}`);
      const amigoSnapshot = await get(amigoRef);

      if (!amigoSnapshot.exists()) {
        throw new Error("O usuário não é seu amigo ou não existe.");
      }
    // Remove o amigo
      await remove(amigoRef);
    } catch (error) {
      throw new Error(error.message || "Erro ao remover amigo.");
    }
  }

async read({ friendEmail }: FriendReadParams = {}): Promise<any> {
  const db = getDatabase();
  const usuariosRef = ref(db, '/usuarios');

  let usuariosQuery;

  if (friendEmail && friendEmail.trim() !== "") {
    
    usuariosQuery = query(
      usuariosRef,
      orderByChild('email'),
      startAt(friendEmail),
      endAt(friendEmail + "\uf8ff")
    );
  } else {
    usuariosQuery = query(
      usuariosRef,
      limitToFirst(20)
    );
  }

  try {
    const snapshot = await get(usuariosQuery);
    if (!snapshot.exists()) return {};
    return snapshot.val();
  } catch (error: any) {
    throw new Error(error.message || "Erro ao ler usuários.");
  }
}

  async update({ userId, nickName , friendId}: FriendParams): Promise<any> {
    const db = getDatabase();
    const amigoRef = ref(db, `/usuarios/${userId}/amigos/${friendId}`);

    try {
      await update(amigoRef, {
        "nickname": nickName
      });
    } catch (error) {
      throw new Error(error.message || "Erro ao atualizar amigo.");
    }
  }
}
