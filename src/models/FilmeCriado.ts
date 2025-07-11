import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Genero from './Genero';
import Ator from './Ator';

interface FilmeFirebaseData {
  title: string;
  poster_path: string;
  genero_ids: { [key: string]: boolean };
  ator_ids: { [key:string]: boolean };
  nativo: boolean;
}

export class FilmeCriado {
  id: string | null;
  title: string;
  poster_path: string;
  nativo: boolean;
  generos: Genero[];
  atores: Ator[];
  genero_ids: { [key: string]: boolean };
  ator_ids: { [key: string]: boolean };

  constructor(
    id: string | null,
    title: string,
    poster_path: string,
    generos: Genero[] = [], // Recebe array de objetos Genero
    atores: Ator[] = [],     // Recebe array de objetos Ator
    nativo: boolean = false,
  ) {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.nativo = nativo;
    this.generos = generos;
    this.atores = atores;

    // Deriva os IDs a partir dos objetos recebidos
    this.genero_ids = this.generos.reduce((acc, genero) => {
      if (genero.id) acc[genero.id] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    this.ator_ids = this.atores.reduce((acc, ator) => {
      if (ator.id) acc[ator.id] = true;
      return acc;
    }, {} as { [key: string]: boolean });
  }

  isValid(): boolean {
    // A validação agora checa diretamente os arrays de objetos
    const hasGeneros = this.generos && this.generos.length > 0;
    const hasAtores = this.atores && this.atores.length > 0;
    return !!(this.title && this.poster_path && hasGeneros && hasAtores);
  }

  // Nenhuma mudança aqui. Já funciona perfeitamente.
  toFirebase() {
    return {
      title: this.title,
      poster_path: this.poster_path,
      genero_ids: this.genero_ids,
      ator_ids: this.ator_ids,
      nativo: this.nativo ?? false,
    };
  }

  // O método fromFirebase não é mais necessário, a lógica foi para o getFilmes...
  
  static async getFilmesCriadosFromFirebase(useCache = true): Promise<FilmeCriado[]> {
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

    const filmesData = filmesSnapshot.val() as Record<string, FilmeFirebaseData>;

    // Monta os arrays de objetos ANTES de instanciar
    const filmes = Object.entries(filmesData).map(([id, data]) => {
      const filmeGeneros = Object.keys(data.genero_ids || {})
        .map(generoId => generosMap.get(generoId))
        .filter((g): g is Genero => g !== undefined);

      const filmeAtores = Object.keys(data.ator_ids || {})
        .map(atorId => atoresMap.get(atorId))
        .filter((a): a is Ator => a !== undefined);
      
      // Instancia o filme já com os objetos completos
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