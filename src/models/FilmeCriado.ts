import { ref, get, DataSnapshot } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Genero from './Genero'; 
import Ator from './Ator';  

interface FilmeFirebaseData {
  title: string;
  poster_path: string;
  genero_ids: { [key: string]: boolean };
  ator_ids: { [key: string]: boolean };
  nativo: boolean;
}

export class FilmeCriado {
  id: string | null;
  title: string;
  poster_path: string;
  nativo: boolean;
  genero_ids: { [key: string]: boolean };
  ator_ids: { [key: string]: boolean };
  
  // Armazenam as instâncias completas dos objetos
  generos: Genero[];
  atores: Ator[];

  constructor(
    id: string | null,
    title: string,
    poster_path: string,
    genero_ids: { [key: string]: boolean } = {},
    ator_ids: { [key: string]: boolean } = {},
    nativo: boolean = false,
  ) {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.nativo = nativo;
    this.genero_ids = genero_ids;
    this.ator_ids = ator_ids;
    this.generos = []; 
    this.atores = [];  
  }

  isValid(): boolean {
    const hasGeneros = this.genero_ids && Object.keys(this.genero_ids).length > 0;
    const hasAtores = this.ator_ids && Object.keys(this.ator_ids).length > 0;
    return !!(this.title && this.poster_path && hasGeneros && hasAtores);
  }


  //Atores e Gêneros completos são omitidos, salvando apenas seus IDs.
  toFirebase() {
    return {
      title: this.title,
      poster_path: this.poster_path,
      genero_ids: this.genero_ids,
      ator_ids: this.ator_ids,
      nativo: this.nativo ?? false,
    };
  }

  static fromFirebase(id: string, data: FilmeFirebaseData): FilmeCriado | null {
    if (!data) return null;
    return new FilmeCriado(
      id,
      data.title || 'Título não disponível',
      data.poster_path || '',
      data.genero_ids || {},
      data.ator_ids || {},
      data.nativo ?? true,
    );
  }

  static async getFilmesCriadosFromFirebase(useCache = true): Promise<FilmeCriado[]> {
    const [filmesSnapshot, generos, atores] = await Promise.all([
      get(ref(database, 'filmes_criados')),
      Genero.getGenerosFromFirebase(useCache), 
      Ator.getAtoresFromFirebase(useCache)      
    ]);

    if (!filmesSnapshot.exists()) {
      return [];
    }

    const generosMap = new Map(generos.map(g => [g.id, g]));
    const atoresMap = new Map(atores.map(a => [a.id, a]));
    const filmesData = filmesSnapshot.val() as Record<string, FilmeFirebaseData>;
    const filmes = Object.entries(filmesData).map(([id, filmeData]) => {
      const filme = FilmeCriado.fromFirebase(id, filmeData);
      if (!filme) return null;

      if (filme.genero_ids) {
        filme.generos = Object.keys(filme.genero_ids)
          .map(generoId => generosMap.get(generoId))
          .filter((g): g is Genero => g !== undefined); 
      }

      if (filme.ator_ids) {
        filme.atores = Object.keys(filme.ator_ids)
          .map(atorId => atoresMap.get(atorId))
          .filter((a): a is Ator => a !== undefined); 
      }
      
      return filme;
    }).filter((f): f is FilmeCriado => f !== null); 

    return filmes;
  }
}