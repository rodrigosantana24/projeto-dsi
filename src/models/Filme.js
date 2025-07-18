import { ref, get, query, limitToFirst, orderByKey, orderByChild, equalTo, startAt, endAt } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Genero from './Genero'; 
import Ator from './Ator';

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
    vote_count = 0,
    credits = '',
    genero_ids = {}, 
    ator_ids = {}
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
    this.credits = credits; 
    this.genero_ids = genero_ids; 
    this.ator_ids = ator_ids;     
  }

  getImageUrl() {
    if (!this.poster_path) return null;
    return this.poster_path.startsWith('http')
      ? this.poster_path
      : `https://image.tmdb.org/t/p/original${this.poster_path}`;
  }

  isValid() {
    return !!(this.title && this.poster_path && Object.keys(this.genero_ids).length > 0 && Object.keys(this.ator_ids).length > 0);
  }

  toFirebase() {
    return {
      title: this.title,
      poster_path: this.poster_path,
      genero_ids: this.genero_ids,
      ator_ids: this.ator_ids,
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
      data.vote_count || 0,
      data.credits || '', 
      data.genero_ids || {}, 
      data.ator_ids || {}   
    );
  }

  static async getFilmesFromFirebase(qtdFilme = 5, useCache = true) {
    if (useCache && this.cache) return this.cache;

    try {
      const filmesRef = ref(database, 'filmes');
      const filmesQuery = query(filmesRef, orderByKey(), limitToFirst(qtdFilme));
      const snapshot = await get(filmesQuery);

      if (!snapshot.exists()) return [];

      const data = snapshot.val();
      const filmes = Object.entries(data).map(
        ([id, filmeData]) => Filme.fromFirebase(id, filmeData)
      );

      if (useCache) this.cache = filmes;
      return filmes;
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      return [];
    }
  }

  static async getFilmesFirebaseFiltrados(termo) {
    if (!termo || termo.trim() === '') return [];

    try {
      const filmesQuery = query(
        ref(database, 'filmes'),
        orderByChild('title'),
        startAt(termo),
        endAt(termo + '\uf8ff'),
        limitToFirst(20)
      );

      const snapshot = await get(filmesQuery);

      if (!snapshot.exists()) return [];

      const data = snapshot.val();
      const filmes = Object.entries(data).map(
        ([id, filmeData]) => Filme.fromFirebase(id, filmeData)
      );

      return filmes;
    } catch (error) {
      console.error('Erro ao buscar filmes filtrados:', error);
      return [];
    }
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
}
