import { ref, set, push, remove } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Filme from './Filme';

export default class FilmeService {
  // CREATE
  static async createFilme({ title, poster_path, genero, atores }) {
    const filme = new Filme(null, title, poster_path, genero, atores);
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }

    const filmesRef = ref(database, 'filmes');
    const newRef = push(filmesRef);
    await set(newRef, filme.toFirebase());
    return Filme.fromFirebase(newRef.key, filme.toFirebase());
  }

  // READ
  static async getAllFilmes(useCache = true) {
    return await Filme.getFilmesFromFirebase(useCache);
  }

  // UPDATE
  static async updateFilme(id, { title, poster_path, genero, atores }) {
    const filme = new Filme(id, title, poster_path, genero, atores);
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }

    const filmeRef = ref(database, `filmes/${id}`);
    await set(filmeRef, filme.toFirebase());
    return filme;
  }

  // DELETE
  static async deleteFilme(id) {
    if (!id) throw new Error('ID do filme é necessário para excluir');
    const filmeRef = ref(database, `filmes/${id}`);
    await remove(filmeRef);
  }
}