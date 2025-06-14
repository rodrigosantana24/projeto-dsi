import { ref, get, query, limitToFirst, orderByKey } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Filme {
  constructor(id, title, poster_path, genero = '', atores = '') {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.genero = genero;
    this.atores = atores;
  }

  getImageUrl() {
    if (!this.poster_path) return null;
    return this.poster_path.startsWith('http')
      ? this.poster_path
      : `https://image.tmdb.org/t/p/original${this.poster_path}`;
  }

  isValid() {
    return !!(this.title && this.genero && this.atores);
  }

  toFirebase() {
    return {
      title: this.title,
      poster_path: this.poster_path,
      genero: this.genero,
      atores: this.atores,
    };
  }

  static fromFirebase(id, data) {
    if (!data) return null;
    return new Filme(
      id,
      data.title || 'Título não disponível',
      data.poster_path || '',
      data.genero || '',
      data.atores || ''
    );
  }

  static async getFilmesFromFirebase(useCache = true) {
    if (useCache && this.cache) return this.cache;
    const filmesRef = ref(database, 'filmes');
    const filmesQuery = query(filmesRef, orderByKey(), limitToFirst(20));
    const snapshot = await get(filmesQuery);
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    const filmes = Object.entries(data).map(
      ([id, filmeData]) => Filme.fromFirebase(id, filmeData)
    );
    if (useCache) this.cache = filmes;
    return filmes;
  }
}
