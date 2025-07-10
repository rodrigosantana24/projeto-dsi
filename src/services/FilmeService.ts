import { ref, set, push, remove, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import FilmeCriado from '../models/FilmeCriado'; 
import Genero from '../models/Genero'; 
import Ator from '../models/Ator';     
import ICrud from './ICrud';

export interface FilmeDTO {
  title: string;
  poster_path: string;
  generos: Genero[]; 
  atores: Ator[];   
  nativo?: boolean;
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
    const { title, poster_path, generos, atores } = data;
    const filme = new FilmeCriado(null, title, poster_path, generos, atores, false);

    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }

    const filmesCriadosRef = ref(database, 'filmes_criados');
    const newRef = push(filmesCriadosRef);
    await set(newRef, filme.toFirebase());
    return FilmeCriado.fromFirebase(newRef.key, { ...filme.toFirebase(), id: newRef.key });
  }

  async read(params: FilmeReadParams): Promise<any> {
    return await FilmeCriado.getFilmesCriadosFromFirebase();
  }

  async update(params: FilmeUpdateDTO): Promise<any> {
    const { id, title, poster_path, generos, atores } = params;
    const filmeRef = ref(database, `filmes_criados/${id}`);
    const snapshot = await get(filmeRef);

    if (!snapshot.exists()) {
      throw new Error('Filme não encontrado para atualização');
    }

    const existingData = snapshot.val();
    const filme = new FilmeCriado(id, title, poster_path, generos, atores, existingData.nativo);
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }

    await set(filmeRef, filme.toFirebase());
    return filme;
  }

  async delete(params: FilmeDeleteDTO): Promise<void> {
    const { id } = params;
    if (!id) throw new Error('ID do filme é necessário para excluir');
    const filmeRef = ref(database, `filmes_criados/${id}`);
    await remove(filmeRef);
  }
}