import { ref, push, set, update, remove, onValue, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig'; // Verifique se o caminho está correto

const filmesRef = ref(database, 'filmes');

class FilmeController {
  // CREATE - Adiciona um novo filme
  addFilme = (filmeData) => {
    const novoFilmeRef = push(filmesRef);
    return set(novoFilmeRef, filmeData);
  }

  // READ - Obtém um filme específico pelo ID
  getAllFilmes = (callback) => {  
  onValue(filmesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const listaFilmes = Object.entries(data).map(
        ([id, filmeData]) => Filme.fromFirebase(id, filmeData)
      );
      callback(listaFilmes);
    } else {
      callback([]);
    }
  });
 }
  
  getFilmesOnce = () => {
    return get(filmesRef);
  }

  // UPDATE - Atualiza um filme existente
  updateFilme = (id, filmeData) => {
    const filmeParaAtualizarRef = ref(database, `filmes/${id}`);
    return update(filmeParaAtualizarRef, filmeData);
  }

  // DELETE - Exclui um filme
  deleteFilme = (id) => {
    const filmeParaExcluirRef = ref(database, `filmes/${id}`);
    return remove(filmeParaExcluirRef);
  }
}

export default new FilmeController();