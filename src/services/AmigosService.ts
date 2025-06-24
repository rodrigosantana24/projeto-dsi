import { getDatabase, ref, set,get, remove } from "firebase/database";
import ICrud from "./ICrud"; // ajuste o path se necessário
import getUserByEmail from "./getUserByEmail";


interface FriendParams {
  userId: string;
  friendEmail: string;
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

  read(): Promise<any> {
    throw new Error('Método não implementado');
  }

  update(): Promise<any> {
    throw new Error('Método não implementado');
  }
}
