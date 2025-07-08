import { ref, get, set, remove } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Amigo {
  constructor(id, userId, amigoId, nickname) {
    this.id = id;
    this.userId = userId;       // ID do usuário que está adicionando o amigo
    this.amigoId = amigoId;     // ID do usuário que é o amigo
    this.nickname = nickname;   // Apelido do amigo (opcional)
  }

  // Valida se os campos obrigatórios estão preenchidos
  isValid() {
    return !!(this.userId && this.amigoId);
  }

  // Converte o objeto para o formato do Firebase
  toFirebase() {
    return {
      amigoId: this.amigoId,
      nickname: this.nickname || null
    };
  }

  // Cria uma instância de Amigo a partir dos dados do Firebase
  static fromFirebase(id, userId, data) {
    return new Amigo(id, userId, data.amigoId, data.nickname || null);
  }

  // Busca todos os amigos de um usuário
  static async getByUser(userId) {
    const snapshot = await get(ref(database, `amigos/${userId}`));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(
      ([id, amigoData]) => Amigo.fromFirebase(id, userId, amigoData)
    );
  }

  // Adiciona/atualiza um amigo no Firebase
  static async save(amigo) {
    if (!amigo.isValid()) {
      throw new Error('Amigo inválido: faltam campos obrigatórios');
    }

    const amigoRef = ref(database, `amigos/${amigo.userId}/${amigo.id || ''}`);
    await set(amigoRef, amigo.toFirebase());
    return amigo;
  }

  // Remove um amigo do Firebase
  static async delete(userId, amigoId) {
    const amigoRef = ref(database, `amigos/${userId}/${amigoId}`);
    await remove(amigoRef);
  }

  // Busca um amigo específico
  static async getById(userId, amigoId) {
    const snapshot = await get(ref(database, `amigos/${userId}/${amigoId}`));
    if (!snapshot.exists()) return null;
    
    return Amigo.fromFirebase(amigoId, userId, snapshot.val());
  }
}