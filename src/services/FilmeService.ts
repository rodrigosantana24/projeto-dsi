import { ref, set, push, remove, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import { FilmeCriado } from '../models/FilmeCriado'; 
import ICrud from './ICrud';

export interface FilmeDTO {
  title: string;
  poster_path: string;
  genero_ids: { [key: string]: boolean };
  ator_ids: { [key: string]: boolean };
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
  async create(data: FilmeDTO): Promise<FilmeCriado> {
    const { title, poster_path, genero_ids, ator_ids } = data;
    // A instância é criada apenas com os IDs.
    const filme = new FilmeCriado(null, title, poster_path, genero_ids, ator_ids, false);
    
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos. Título, pôster, gêneros e atores são obrigatórios.');
    }

    const filmesCriadosRef = ref(database, 'filmes_criados');
    const newRef = push(filmesCriadosRef);
    
    // O método toFirebase() garante que apenas os IDs serão salvos.
    await set(newRef, filme.toFirebase());

    filme.id = newRef.key;
    return filme;
  }

  async read(params: FilmeReadParams): Promise<FilmeCriado[]> {
    const { useCache = true } = params;
    // Este método transforma OS IDs de Gênero e Ator em objetos.
    return await FilmeCriado.getFilmesCriadosFromFirebase(useCache);
  }

  async update(params: FilmeUpdateDTO): Promise<FilmeCriado> {
    const { id, title, poster_path, genero_ids, ator_ids } = params;
    const filmeRef = ref(database, `filmes_criados/${id}`);
    const snapshot = await get(filmeRef);

    if (!snapshot.exists()) {
      throw new Error('Filme não encontrado para atualização');
    }

    const existingData = snapshot.val();
    const filme = new FilmeCriado(id, title, poster_path, genero_ids, ator_ids, existingData.nativo);

    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }

    // toFirebase() garante que apenas os IDs sejam enviados para o banco.
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