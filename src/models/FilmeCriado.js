import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Genero from './Genero'; 
import Ator from './Ator';

export class FilmeCriado {
  /**
   * @param {string | null} id
   * @param {string} title
   * @param {string} poster_path
   * @param {Genero[]} [generos=[]]
   * @param {Ator[]} [atores=[]]
   * @param {boolean} [nativo=false]
   */
  constructor(
    id,
    title,
    poster_path,
    generos = [],
    atores = [],     
    nativo = false,
  ) {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.nativo = nativo;
    this.generos = generos;
    this.atores = atores;
  }

  isValid() {
    const hasGeneros = this.generos && this.generos.length > 0;
    const hasAtores = this.atores && this.atores.length > 0;
    return !!(this.title && this.poster_path && hasGeneros && hasAtores);
  }

  toFirebase() {
    const genero_ids = this.generos.reduce((acc, genero) => {
      if (genero.id) acc[genero.id] = true;
      return acc;
    }, {});

    const ator_ids = this.atores.reduce((acc, ator) => {
      if (ator.id) acc[ator.id] = true;
      return acc;
    }, {});

    return {
      title: this.title,
      poster_path: this.poster_path,
      genero_ids: genero_ids,
      ator_ids: ator_ids,
      nativo: this.nativo ?? false,
    };
  }
  
  static async getFilmesCriadosFromFirebase(useCache = true) {
    const [filmesSnapshot, todosGeneros, todosAtores] = await Promise.all([
      get(ref(database, 'filmes_criados')),
      Genero.getGenerosFromFirebase(useCache),
      Ator.getAtoresFromFirebase(useCache)
    ]);

    if (!filmesSnapshot.exists()) {
      return [];
    }

    const generosMap = new Map(todosGeneros.map(g => [g.id, g]));
    const atoresMap = new Map(todosAtores.map(a => [a.id, a]));
    const filmesData = filmesSnapshot.val();
    
    const filmes = Object.entries(filmesData).map(([id, data]) => {
      const filmeGeneros = Object.keys(data.genero_ids || {})
        .map(generoId => generosMap.get(generoId))
        .filter(g => g !== undefined);

      const filmeAtores = Object.keys(data.ator_ids || {})
        .map(atorId => atoresMap.get(atorId))
        .filter(a => a !== undefined);
      
      return new FilmeCriado(
        id,
        data.title,
        data.poster_path,
        filmeGeneros,
        filmeAtores,
        data.nativo ?? true,
      );
    });

    return filmes;
  }
}