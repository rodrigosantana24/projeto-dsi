import { ref, get, set, update, remove } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Usuario {
  constructor(id, email, name, amigos = {}, favoritos = [], filmes = []) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.amigos = amigos;       // Objeto { amigoId: { amigo_id, nickname } }
    this.favoritos = favoritos;  // Array de IDs de filmes favoritos
    this.filmes = filmes;       // Array de IDs de filmes
  }

  // Validação básica
  isValid() {
    return !!(this.id && this.email && this.name);
  }

  // Converte para formato Firebase
  toFirebase() {
    return {
      email: this.email,
      name: this.name,
      amigos: this.amigos || {},
      favoritos: this.favoritos || [],
      filmes: this.filmes || []
    };
  }

  // Cria instância a partir dos dados do Firebase
  static fromFirebase(id, data) {
    return new Usuario(
      id,
      data.email,
      data.name,
      data.amigos || {},
      data.favoritos || [],
      data.filmes || []
    );
  }
}