import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

const db = database;
const filmeCache = new Map(); // cache simples em memória

export default async function getFilme(id) {
  if (filmeCache.has(id)) {
    return filmeCache.get(id);
  }
  try {
    const filmeRef = ref(db, `filmes/${id}`);
    const snapshot = await get(filmeRef);
    const data = snapshot.exists() ? snapshot.val() : null;

    if (data) {
      filmeCache.set(id, data); // salva no cache
    }

    return data;
  } catch (error) {
    console.error(`Erro ao buscar filme ${id}`, error);
    return null;
  }
}