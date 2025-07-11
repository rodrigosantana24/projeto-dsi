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
  
  /**
   * Cria um novo filme no banco de dados.
   * @param data - Os dados do filme para criar.
   * @returns O filme criado com seu ID.
   */
  async create(data: FilmeDTO): Promise<FilmeCriado> {
    const { title, poster_path, genero_ids, ator_ids } = data;
    
    // A instância é criada apenas com os IDs, como deve ser para validação inicial.
    const filme = new FilmeCriado(null, title, poster_path, genero_ids, ator_ids, false);
    
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos. Título, pôster, gêneros e atores são obrigatórios.');
    }

    const filmesCriadosRef = ref(database, 'filmes_criados');
    const newRef = push(filmesCriadosRef);
    
    // O método toFirebase() garante que apenas os IDs serão salvos.
    await set(newRef, filme.toFirebase());
    
    // Retorna a instância completa (ainda sem os objetos de gênero/ator populados, pois não é necessário aqui)
    filme.id = newRef.key;
    return filme;
  }

  /**
   * Lê a lista de filmes do banco de dados, populando os gêneros e atores.
   * @param params - Opções de leitura, como o uso de cache.
   * @returns Uma lista de instâncias de FilmeCriado com os dados completos.
   */
  async read(params: FilmeReadParams): Promise<FilmeCriado[]> {
    const { useCache = true } = params;
    // Este método já faz a "mágica" de transformar IDs em objetos.
    return await FilmeCriado.getFilmesCriadosFromFirebase(useCache);
  }

  /**
   * Atualiza um filme existente.
   * @param params - Os dados do filme para atualizar, incluindo o ID.
   * @returns A instância do filme atualizado.
   */
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
    
    // Idealmente, após atualizar, você poderia querer retornar o filme com os atores/gêneros populados.
    // Por simplicidade, retornamos a instância como está. Se precisar dos dados completos,
    // seria necessário buscar os atores/gêneros novamente.
    return filme;
  }

  /**
   * Exclui um filme do banco de dados.
   * @param params - O ID do filme a ser excluído.
   */
  async delete(params: FilmeDeleteDTO): Promise<void> {
    const { id } = params;
    if (!id) throw new Error('ID do filme é necessário para excluir');
    const filmeRef = ref(database, `filmes_criados/${id}`);
    await remove(filmeRef);
  }
}
