import { ref, get, query, limitToFirst, orderByKey } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Filme {
  constructor(
    id, 
    title, 
    poster_path, 
    genero = '', 
    atores = '',
    nativo,
    overview = '',
    budget = 0,
    revenue = 0,
    runtime = 0,
    status = '',
    original_language = '',
    popularity = 0,
    production_companies = '',
    release_date = '',
    vote_average = 0,
    vote_count = 0
  ) {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.genero = genero;
    this.atores = atores;
    this.nativo = nativo;
    this.overview = overview;
    this.budget = budget;
    this.revenue = revenue;
    this.runtime = runtime;
    this.status = status;
    this.original_language = original_language;
    this.popularity = popularity;
    this.production_companies = production_companies;
    this.release_date = release_date;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
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
      nativo: this.nativo ?? false,
    };
  }

  static fromFirebase(id, data) {
    if (!data) return null;

    let generoDoFilme = data.genero || '';
    if (data.genres && Array.isArray(data.genres) && data.genres.length > 0) {
      generoDoFilme = data.genres[0].name;
    }

    return new Filme(
      id,
      data.title || 'Título não disponível',
      data.poster_path || '',
      generoDoFilme,
      data.atores || '', 
      data.nativo ?? true,
      data.overview || '',
      data.budget || 0,
      data.revenue || 0,
      data.runtime || 0,
      data.status || '',
      data.original_language || '',
      data.popularity || 0,
      data.production_companies || '',
      data.release_date || '',
      data.vote_average || 0,
      data.vote_count || 0
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
  static async getAllFilmesFromFirebase(useCache = true) {
    if (useCache && this.cache) return this.cache;
    const filmesRef = ref(database, 'filmes');
    const filmesQuery = query(filmesRef, orderByKey(), limitToFirst(1000));
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

  static async getFilmesByPrimaryGenreId(genreId, limit = 20) {
    const filmesRef = ref(database, 'filmes');
    const filmesQuery = query(
      filmesRef,
      orderByChild('primary_genre_id'),
      equalTo(genreId),
      limitToFirst(limit)
    );
    const snapshot = await get(filmesQuery);
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    return Object.entries(data).map(
      ([id, filmeData]) => Filme.fromFirebase(id, filmeData)
    );
  }
  static async getFilmesCriadosFromFirebase(useCache = true) {
    if (useCache && this.cacheAlt) return this.cacheAlt;
    const filmesRef = ref(database, 'filmes_criados');
    const snapshot = await get(filmesRef);
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    const filmes = Object.entries(data)
      .map(([id, filmeData]) => Filme.fromFirebase(id, filmeData));
    if (useCache) this.cacheAlt = filmes;
    return filmes;
  }
}
