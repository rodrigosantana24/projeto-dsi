import { ref, set, push, remove, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Filme from './Filme';
import ICrud from './ICrud';

export interface FilmeDTO {
  title: string;
  poster_path: string;
  genero: string;
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
  const { title, poster_path, genero } = data;
  const filme = new Filme(null, title, poster_path, genero);
  filme.nativo = false;
  if (!filme.isValid()) {
    throw new Error('Dados do filme inválidos');
  }
  const filmesCriadosRef = ref(database, 'filmes_criados');
  const newRef = push(filmesCriadosRef);
  await set(newRef, filme.toFirebase());
  return Filme.fromFirebase(newRef.key, filme.toFirebase());
}

  async read(params: FilmeReadParams): Promise<any> {
    const { useCache = true } = params;
    return await Filme.getFilmesCriadosFromFirebase(useCache);
  }

  async update(params: FilmeUpdateDTO): Promise<any> {
    const { id, title, poster_path, genero } = params;
    const filmeRef = ref(database, `filmes_criados/${id}`);
    const snapshot = await get(filmeRef);
    if (!snapshot.exists()) {
      throw new Error('Filme não encontrado para atualização');
    }
    const existingData = snapshot.val();
    const filme = new Filme(id, title, poster_path, genero, existingData.nativo);
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