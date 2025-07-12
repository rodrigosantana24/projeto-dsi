import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Filme from './Filme'; 

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
      this.filme.id 
    );
  }

  toFirebase() {
    return {
      data: this.data,
      hora: this.hora,
      filmeId: this.filme.id,
    };
  }

  static async fromFirebase(id, userId, data) {
    const filmeIdDoBanco = data.filmeId; 
    let filmeCompleto = null;

    if (filmeIdDoBanco) {
      try {
        filmeCompleto = await Filme.getById(filmeIdDoBanco);
      } catch (error) {
        filmeCompleto = { id: filmeIdDoBanco, title: 'Filme (Erro/Não encontrado)', poster_path: '' };
      }
    }

    return new Agendamento(
      id,
      userId,
      data.data,
      data.hora,
      filmeCompleto 
    );
  }

  static async getByUser(userId) {
    const snapshot = await get(ref(database, `agendamentos/${userId}`));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const agendamentosPromises = Object.entries(data).map(
      ([id, agendamentoData]) => Agendamento.fromFirebase(id, userId, agendamentoData)
    );
    return Promise.all(agendamentosPromises);
  }
}