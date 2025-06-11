import { ref, get, query, limitToFirst, orderByKey } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Filme {
  constructor(id, title, poster_path) {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
  }

  getImageUrl() {
    if (!this.poster_path) return null;
    return this.poster_path.startsWith('http')
      ? this.poster_path
      : `https://image.tmdb.org/t/p/original${this.poster_path}`;
  }

  static fromFirebase(id, data) {
    if (!data) return null;
    return new Filme(
      id,
      data.title || 'Título não disponível',
      data.poster_path || ''
    );
  }

  static async getFilmesFromFirebase(useCache = true) {
    try {
      if (useCache && this.cache) {
        return this.cache;
      }

      const filmesRef = ref(database, 'filmes');
      const filmesQuery = query(
        filmesRef,
        orderByKey(),
        limitToFirst(20)
      );

      const snapshot = await get(filmesQuery);

      if (!snapshot.exists()) {
        throw new Error('Nenhum filme encontrado');
      }

      const data = snapshot.val();

      const filmes = Object.entries(data).map(
        ([id, filmeData]) => Filme.fromFirebase(id, filmeData)
      );

      if (useCache) {
        this.cache = filmes;
      }

      return filmes;
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      throw new Error('Não foi possível carregar os filmes');
    }
  }
}