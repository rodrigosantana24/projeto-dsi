import { ref, set, push, remove } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Filme from './Filme';
import ICrud from './ICrud';

export interface FilmeDTO {
  title: string;
  poster_path: string;
  genero: string;
  atores: string;
}

export interface FilmeUpdateDTO extends FilmeDTO {
  id: string;
}

export interface FilmeDeleteDTO {
  id: string;
}

export interface FilmeReadParams {
  useCache?: boolean;
}

export default class FilmeService implements ICrud<FilmeDTO, FilmeReadParams, FilmeUpdateDTO, FilmeDeleteDTO> {
  async create(data: FilmeDTO): Promise<any> {
    const { title, poster_path, genero, atores } = data;
    const filme = new Filme(null, title, poster_path, genero, atores);
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }
    const filmesRef = ref(database, 'filmes');
    const newRef = push(filmesRef);
    await set(newRef, filme.toFirebase());
    return Filme.fromFirebase(newRef.key, filme.toFirebase());
  }

  async read(params: FilmeReadParams): Promise<any> {
    const { useCache = true } = params;
    return await Filme.getFilmesFromFirebase(useCache);
  }

  async update(params: FilmeUpdateDTO): Promise<any> {
    const { id, title, poster_path, genero, atores } = params;
    const filme = new Filme(id, title, poster_path, genero, atores);
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }

    const filmeRef = ref(database, `filmes/${id}`);
    await set(filmeRef, filme.toFirebase());
    return filme;
  }

  async delete(params: FilmeDeleteDTO): Promise<void> {
    const { id } = params;
    if (!id) throw new Error('ID do filme é necessário para excluir');
    const filmeRef = ref(database, `filmes/${id}`);
    await remove(filmeRef);
  }
}
