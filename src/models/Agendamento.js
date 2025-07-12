import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Agendamento {
  constructor(id, userId, data, hora, filme) {
    this.id = id;
    this.userId = userId;
    this.data = data;
    this.hora = hora;
    this.filme = filme; 
  }

  isValid() {
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
      filme: {
        id: this.filme.id,
        title: this.filme.title,
        poster_path: this.filme.poster_path,
      },
    };
  }

  static fromFirebase(id, userId, data) {
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