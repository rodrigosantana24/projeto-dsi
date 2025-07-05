import { ref, set, push, remove, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Filme from '../models/Filme';
import ICrud from './ICrud';

export interface FilmeDTO {
  title: string;
  poster_path: string;
  genero_ids: { [key: string]: boolean };
  ator_ids: { [key: string]: boolean };
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
    const { title, poster_path, genero_ids, ator_ids } = data;
    const filme = new Filme(null, title, poster_path, '', '', false, '', 0, 0, 0, '', '', 0, '', '', 0, 0, '', genero_ids, ator_ids);
    
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }

    const filmesCriadosRef = ref(database, 'filmes_criados');
    const newRef = push(filmesCriadosRef);
    await set(newRef, filme.toFirebase());
    return Filme.fromFirebase(newRef.key, { ...filme.toFirebase(), id: newRef.key });
  }

  async read(params: FilmeReadParams): Promise<any> {
    const { useCache = true } = params;
    return await Filme.getFilmesCriadosFromFirebase(useCache);
  }

  async update(params: FilmeUpdateDTO): Promise<any> {
    const { id, title, poster_path, genero_ids, ator_ids } = params;
    const filmeRef = ref(database, `filmes_criados/${id}`);
    const snapshot = await get(filmeRef);

    if (!snapshot.exists()) {
      throw new Error('Filme não encontrado para atualização');
    }

    const existingData = snapshot.val();
    const filme = new Filme(id, title, poster_path, '', '', existingData.nativo, '', 0, 0, 0, '', '', 0, '', '', 0, 0, '', genero_ids, ator_ids);
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