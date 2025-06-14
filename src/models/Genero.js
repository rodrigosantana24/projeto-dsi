import { ref, get, query, limitToFirst, orderByKey } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Genero {
  constructor(id, nome, descricao, nativo = false) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.nativo = nativo;
  }

  isValid() {
    return !!(this.nome && this.descricao);
  }

  toFirebase() {
    return {
      nome: this.nome,
      descricao: this.descricao,
      nativo: this.nativo ?? false,
    };
  }

  static fromFirebase(id, data) {
    if (!data) return null;
    return new Genero(
      id,
      data.nome || '',
      data.descricao || '',
      data.nativo ?? true
    );
  }

  static async getGenerosFromFirebase(useCache = true) {
    if (useCache && this.cache) return this.cache;
    const generosRef = ref(database, 'generos');
    const generosQuery = query(generosRef, orderByKey(), limitToFirst(100));
    const snapshot = await get(generosQuery);
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    const generos = Object.entries(data).map(
      ([id, generoData]) => Genero.fromFirebase(id, generoData)
    );
    if (useCache) this.cache = generos;
    return generos;
  }
}