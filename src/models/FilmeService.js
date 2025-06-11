import { ref, set, push, remove } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Filme from './Filme';

export default class FilmeService {
  static async addFilme(filme) {
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }
    const filmesRef = ref(database, 'filmes');
    const newRef = push(filmesRef);
    await set(newRef, filme.toFirebase());
    return newRef.key;
  }

  static async updateFilme(filme) {
    if (!filme.id) {
      throw new Error('Filme precisa de ID para atualizar');
    }
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }
    const filmeRef = ref(database, `filmes/${filme.id}`);
    await set(filmeRef, filme.toFirebase());
  }

  static async deleteFilme(id) {
    const filmeRef = ref(database, `filmes/${id}`);
    await remove(filmeRef);
  }

  static async getAllFilmes(useCache = true) {
    return Filme.getFilmesFromFirebase(useCache);
  }
}