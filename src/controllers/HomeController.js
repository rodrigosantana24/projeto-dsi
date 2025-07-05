import Filme from '../models/Filme';

export default class HomeController {
  constructor(navigation) {
    this.navigation = navigation;
    this.filtros = ['Ação', 'Comédia', 'Terror', 'Romance', 'Suspense', 'Drama'];
    this.listaFilmes = [];
    this.carregando = true;
    this.erro = null;
  }

  configurarLayout() {
    this.navigation.setOptions({ 
      headerBackVisible: false,
      headerTitle: 'Catálogo de Filmes'
    });
  }

  async carregarFilmes() {
    try {
      this.carregando = true;
      this.erro = null;
      
      this.listaFilmes = await Filme.getFilmesFromFirebase();
      return this.listaFilmes;
      
    } catch (error) {
      console.error("Erro ao carregar filmes:", error);
      this.erro = "Não foi possível carregar os filmes. Tente novamente.";
      return [];
      
    } finally {
      this.carregando = false;
    }
  }

  /*
  getFiltros() {
    return ['Todos', ...this.filtros];
  }
  */

  getFiltros() {
  return [
    { label: 'Ação', id: 0 },
    { label: 'Comédia', id: 3 },
    { label: 'Terror', id: 10 },
    { label: 'Romance', id: 13 },
    { label: 'Suspense', id: 16 },
    { label: 'Drama', id: 6 },
  ];
}

  getFilmes() {
    return this.listaFilmes;
  }

  estaCarregando() {
    return this.carregando;
  }

  getErro() {
    return this.erro;
  }

  async getFilmesByPrimaryGenreId(genreId, limit = 100) {
    return await Filme.getFilmesByPrimaryGenreId(genreId, limit);r
  }

  async searchFilmesByName(searchTerm) {
    const filmes = await Filme.getFilmesFromFirebase(2000, false);
    if (!searchTerm) return filmes;
    const lower = searchTerm.toLowerCase();
    return filmes.filter(f =>
      (f.title || f.titulo || '').toLowerCase().includes(lower)
    );
  }
}