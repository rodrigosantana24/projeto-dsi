import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Genero from './Genero'; 
import Ator from './Ator';

export default class FilmeCriado {
  genero_ids;
  ator_ids;
  constructor(
    id,
    title,
    poster_path,
    genero_ids = [],
    ator_ids = [], 
    nativo = false
  ) {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.nativo = nativo;
    this.genero_ids = genero_ids;
    this.ator_ids = ator_ids;
  }

  isValid() {
    return !!(this.title && this.poster_path && this.generos.length > 0 && this.elenco.length > 0);
  }

  toFirebase() {
    return {
      title: this.title,
      poster_path: this.poster_path,
      nativo: this.nativo ?? false,
      generos: this.generos.map(g => ({ id: g.id, nome: g.nome, descricao: g.descricao, nativo: g.nativo })),
      atores: this.elenco.map(a => ({ id: a.id, nome: a.nome, nacionalidade: a.nacionalidade, sexo: a.sexo })),
    };
  }

  static fromFirebase(id, data) {
    if (!data) return null;
    const atoresObj = (data.atores || []).map(aData => new Ator(aData.id, aData.nome, aData.nacionalidade, aData.sexo));
    const generosObj = (data.generos || []).map(gData => new Genero(gData.id, gData.nome, gData.descricao, gData.nativo));
    const filme = new FilmeCriado(id, data.title, data.poster_path, generosObj, atoresObj, data.nativo);
    filme.genero = generosObj.map(g => g.nome).join(', ');
    filme.atores = atoresObj.map(a => a.nome).join(', ');
    return filme;
  }

  static async getFilmesCriadosFromFirebase() {
    const filmesRef = ref(database, 'filmes_criados');
    const snapshot = await get(filmesRef);
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    const filmes = Object.entries(data).map(([id, filmeData]) => {
      const filme = this.fromFirebase(id, filmeData);
      return filme;
    });
    return filmes;
  }
}