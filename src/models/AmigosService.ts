import { getDatabase, ref, set, remove } from "firebase/database";
import ICrud from "./ICrud"; // ajuste o path se necessário

interface FriendParams {
  userId: string;
  friendId: string;
}

export default class AmigosService implements ICrud<FriendParams, never, never, FriendParams> {
  async create({ userId, friendId }: FriendParams): Promise<void> {
    const db = getDatabase();
    const amigoRef = ref(db, `/usuarios/${userId}/amigos/${friendId}`);
    await set(amigoRef, {
      amigo_id: friendId
    });
  }

  async delete({ userId, friendId }: FriendParams): Promise<void> {
    const db = getDatabase();
    const amigoRef = ref(db, `/usuarios/${userId}/amigos/${friendId}`);
    await remove(amigoRef);
  }

  read(): Promise<any> {
    throw new Error('Método não implementado');
  }

  update(): Promise<any> {
    throw new Error('Método não implementado');
  }
}
