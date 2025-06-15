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

  getFiltros() {
    return ['Todos', ...this.filtros];
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
}