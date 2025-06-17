import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Agendamento {
  constructor(id, userId, data, hora, filmeId) {
    this.id = id;
    this.userId = userId;
    this.data = data;
    this.hora = hora;
    this.filmeId = filmeId;
  }

  isValid() {
    return !!(this.userId && this.data && this.hora && this.filmeId);
  }

  toFirebase() {
    return {
      data: this.data,
      hora: this.hora,
      filmeId: this.filmeId,
    };
  }

  static fromFirebase(id, userId, data) {
    return new Agendamento(id, userId, data.data, data.hora, data.filmeId);
  }

  static async getByUser(userId) {
    const snapshot = await get(ref(database, `agendamentos/${userId}`));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(
      ([id, agendamentoData]) => Agendamento.fromFirebase(id, userId, agendamentoData)
    );
  }
}
