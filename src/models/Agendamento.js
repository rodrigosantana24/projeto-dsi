import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Agendamento {
  // Alteração: filme agora é um objeto com id, title, poster_path
  constructor(id, userId, data, hora, filme) {
    this.id = id;
    this.userId = userId;
    this.data = data;
    this.hora = hora;
    this.filme = filme; // Agora armazena o objeto filme
  }

  isValid() {
    // Valida se o objeto filme e seus campos essenciais existem
    return !!(
      this.userId &&
      this.data &&
      this.hora &&
      this.filme &&
      this.filme.id &&
      this.filme.title &&
      this.filme.poster_path
    );
  }

  toFirebase() {
    return {
      data: this.data,
      hora: this.hora,
      // Alteração: Salva o objeto filme com id, title e poster_path
      filme: {
        id: this.filme.id,
        title: this.filme.title,
        poster_path: this.filme.poster_path,
      },
    };
  }

  static fromFirebase(id, userId, data) {
    // Alteração: Recupera o objeto filme do Firebase
    // Garante que data.filme exista antes de acessar suas propriedades
    const filmeData = data.filme || {}; 
    return new Agendamento(
      id,
      userId,
      data.data,
      data.hora,
      {
        id: filmeData.id,
        title: filmeData.title,
        poster_path: filmeData.poster_path,
      } // Passa o objeto filme
    );
  }

  // O método getByUser não precisa de muitas mudanças, pois ele chama fromFirebase
  static async getByUser(userId) {
    const snapshot = await get(ref(database, `agendamentos/${userId}`));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(
      ([id, agendamentoData]) => Agendamento.fromFirebase(id, userId, agendamentoData)
    );
  }
}