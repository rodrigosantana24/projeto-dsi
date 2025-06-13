// src/services/getFilme.js
import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

const db = database;

export default async function getFilme(id) {
  try {
    const filmeRef = ref(db, `filmes/${id}`);
    const snapshot = await get(filmeRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error(`Erro ao buscar filme ${id}`, error);
    return null;
  }
}
