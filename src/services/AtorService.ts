import { ref, set, push, remove } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Ator from '../models/Ator';
import ICrud from './ICrud';

export interface AtorDTO {
  nome: string;
  nacionalidade: string;
  sexo: string; 
}

export interface AtorUpdateDTO extends AtorDTO {
  id: string;
}

export interface AtorDeleteDTO {
  id: string;
}

export interface AtorReadParams {
  useCache?: boolean;
}

export default class AtorService implements ICrud<AtorDTO, AtorReadParams, AtorUpdateDTO, AtorDeleteDTO> {
  async create(data: AtorDTO): Promise<any> {
    const { nome, nacionalidade, sexo } = data;
    const ator = new Ator(null, nome, nacionalidade, sexo);
    if (!ator.isValid()) {
      throw new Error('Dados do ator inválidos');
    }
    const atoresRef = ref(database, 'atores');
    const newRef = push(atoresRef);
    await set(newRef, ator.toFirebase());
    return Ator.fromFirebase(newRef.key, ator.toFirebase());
  }
  async read(params: AtorReadParams): Promise<any> {
    const { useCache = true } = params;
    return await Ator.getAtoresFromFirebase(useCache);
  }
  async update(params: AtorUpdateDTO): Promise<any> {
    const { id, nome, nacionalidade, sexo } = params;
    const ator = new Ator(id, nome, nacionalidade, sexo);
    if (!ator.isValid()) {
      throw new Error('Dados do gênero inválidos');
    }
    const atorRef = ref(database, `atores/${id}`);
    await set(atorRef, ator.toFirebase());
    return ator;
  }
  async delete(params: AtorDeleteDTO): Promise<void> {
    const { id } = params;
    if (!id) throw new Error('ID do ator é necessário para excluir');
    const AtorRef = ref(database, `atores/${id}`);
    await remove(AtorRef);
  }
}
