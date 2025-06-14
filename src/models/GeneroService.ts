import { ref, set, push, remove } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Genero from './Genero';
import ICrud from './ICrud';

export interface GeneroDTO {
  nome: string;
  descricao: string;
}

export interface GeneroUpdateDTO extends GeneroDTO {
  id: string;
}

export interface GeneroDeleteDTO {
  id: string;
}

export interface GeneroReadParams {
  useCache?: boolean;
}

export default class GeneroService implements ICrud<GeneroDTO, GeneroReadParams, GeneroUpdateDTO, GeneroDeleteDTO> {
  async create(data: GeneroDTO): Promise<any> {
    const { nome, descricao } = data;
    const genero = new Genero(null, nome, descricao);
    genero.nativo = false;
    if (!genero.isValid()) {
      throw new Error('Dados do gênero inválidos');
    }
    const generosRef = ref(database, 'generos');
    const newRef = push(generosRef);
    await set(newRef, genero.toFirebase());
    return Genero.fromFirebase(newRef.key, genero.toFirebase());
  }

  async read(params: GeneroReadParams): Promise<any> {
    const { useCache = true } = params;
    return await Genero.getGenerosFromFirebase(useCache);
  }

  async update(params: GeneroUpdateDTO): Promise<any> {
    const { id, nome, descricao } = params;
    const genero = new Genero(id, nome, descricao);
    if (!genero.isValid()) {
      throw new Error('Dados do gênero inválidos');
    }

    const generoRef = ref(database, `generos/${id}`);
    await set(generoRef, genero.toFirebase());
    return genero;
  }

  async delete(params: GeneroDeleteDTO): Promise<void> {
    const { id } = params;
    if (!id) throw new Error('ID do gênero é necessário para excluir');
    const generoRef = ref(database, `generos/${id}`);
    await remove(generoRef);
  }
}
