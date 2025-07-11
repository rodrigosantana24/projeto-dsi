import { ref, set, push, remove, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import { FilmeCriado } from '../models/FilmeCriado'; 
import ICrud from './ICrud';
import Genero from '../models/Genero';
import Ator from '../models/Ator';

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
    const [todosGeneros, todosAtores] = await Promise.all([
        Genero.getGenerosFromFirebase(),
        Ator.getAtoresFromFirebase()
    ]);

    // Filtra para encontrar os objetos completos que correspondem aos IDs recebidos
    const generosDoFilme = todosGeneros.filter(g => g.id && genero_ids[g.id]);
    const atoresDoFilme = todosAtores.filter(a => a.id && ator_ids[a.id]);

    // Instancia o filme passando os objetos completos
    const filme = new FilmeCriado(
      null, 
      title, 
      poster_path, 
      generosDoFilme, 
      atoresDoFilme, 
      false
    );
    
    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos. Título, pôster, gêneros e atores são obrigatórios.');
    }

    // 4. Salva no Firebase apenas os IDs
    const filmesCriadosRef = ref(database, 'filmes_criados');
    const newRef = push(filmesCriadosRef);
    await set(newRef, filme.toFirebase());

    filme.id = newRef.key;
    
    return filme;
  }

  async read(params: FilmeReadParams): Promise<FilmeCriado[]> {
    const { useCache = true } = params;
    return await FilmeCriado.getFilmesCriadosFromFirebase(useCache);
  }

  async update(params: FilmeUpdateDTO): Promise<FilmeCriado> {
    const { id, title, poster_path, genero_ids, ator_ids } = params;
    const filmeRef = ref(database, `filmes_criados/${id}`);
    const snapshot = await get(filmeRef);

    if (!snapshot.exists()) {
      throw new Error('Filme não encontrado para atualização');
    }

    const [todosGeneros, todosAtores] = await Promise.all([
      Genero.getGenerosFromFirebase(),
      Ator.getAtoresFromFirebase()
    ]);

    const generosDoFilme = todosGeneros.filter(g => g.id && genero_ids[g.id]);
    const atoresDoFilme = todosAtores.filter(a => a.id && ator_ids[a.id]);

    const existingData = snapshot.val();
    
    // Instancia o filme com os arrays de objetos Ator e Genero
    const filme = new FilmeCriado(
      id, 
      title, 
      poster_path, 
      generosDoFilme, 
      atoresDoFilme, 
      existingData.nativo
    );

    if (!filme.isValid()) {
      throw new Error('Dados do filme inválidos');
    }

    // O método toFirebase() garante que apenas os IDs sejam enviados para o banco
    await set(filmeRef, filme.toFirebase());
    
    // Retorna a instância completa
    return filme;
  }

  async delete(params: FilmeDeleteDTO): Promise<void> {
    const { id } = params;
    if (!id) throw new Error('ID do filme é necessário para excluir');
    const filmeRef = ref(database, `filmes_criados/${id}`);
    await remove(filmeRef);
  }
}