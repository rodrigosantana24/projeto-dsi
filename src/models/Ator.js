import { ref, get, query, limitToFirst, orderByKey, orderByChild, equalTo } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Ator {
  constructor(id, nome, nacionalidade, sexo) {
    this.id = id;
    this.nome = nome;
    this.nacionalidade = nacionalidade;
    this.sexo = sexo;
  }
  isValid() {
    return !!(this.nome && this.nacionalidade && this.sexo);
  }
  toFirebase() {
    return {
      nome: this.nome,
      nacionalidade: this.nacionalidade,
      sexo: this.sexo,
    };
  }
  static fromFirebase(id, data) {
    if (!data) return null;
    return new Ator(
      id,
      data.nome || '',
      data.nacionalidade|| '',
      data.sexo || ''
    );
  }
  static async getAtoresFromFirebase(useCache = true) {
    if (useCache && this.cache) return this.cache;
    const atoresRef = ref(database, 'atores');
    const atoresQuery = query(atoresRef, orderByKey(), limitToFirst(100));
    const snapshot = await get(atoresQuery);
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    const atores = Object.entries(data).map(
      ([id, atorData]) => Ator.fromFirebase(id, atorData)
    );
    if (useCache) this.cache = atores;
    return atores;
  }
  static async getAtoresBySexoFromFirebase(sexo, useCache = true) {
  if (useCache && this.cache && this.cacheSexo === sexo) return this.cache;
  const atoresRef = ref(database, 'atores');
  const atoresQuery = query(
    atoresRef,
    orderByChild('sexo'),
    equalTo(sexo),
    limitToFirst(100)
  );
  const snapshot = await get(atoresQuery);
  if (!snapshot.exists()) {
    return [];
  }
  const data = snapshot.val();
  const atores = Object.entries(data).map(
    ([id, atorData]) => Ator.fromFirebase(id, atorData)
  );
  if (useCache) {
    this.cache = atores;
    this.cacheSexo = sexo;
  }
  return atores;
  }
}