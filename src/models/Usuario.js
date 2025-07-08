import { ref, get, set, update, remove } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default class Usuario {
  constructor(id, email, name, amigos = {}, favoritos = {}, filmes = {}) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.amigos = amigos;       // Objeto { amigoId: { nickname, dataAdicao } }
    this.favoritos = favoritos;  // Objeto { filmeId: true }
    this.filmes = filmes;       // Objeto { filmeId: { data, nota, ... } }
  }

  // Validação básica
  isValid() {
    return !!(this.id && this.email && this.name);
  }

  // Converte para formato Firebase
  toFirebase() {
    return {
      email: this.email,
      name: this.name,
      amigos: this.amigos || {},
      favoritos: this.favoritos || {},
      filmes: this.filmes || {}
    };
  }

  // Cria instância a partir dos dados do Firebase
  static fromFirebase(id, data) {
    return new Usuario(
      id,
      data.email,
      data.name,
      data.amigos || {},
      data.favoritos || {},
      data.filmes || {}
    );
  }

  // --- Métodos CRUD ---
  static async create(usuario) {
    if (!usuario.isValid()) {
      throw new Error('Usuário inválido: faltam campos obrigatórios');
    }

    const usuarioRef = ref(database, `usuarios/${usuario.id}`);
    await set(usuarioRef, usuario.toFirebase());
    return usuario;
  }

  static async getById(id) {
    const snapshot = await get(ref(database, `usuarios/${id}`));
    if (!snapshot.exists()) return null;
    
    return Usuario.fromFirebase(id, snapshot.val());
  }

  static async update(id, updates) {
    const usuarioRef = ref(database, `usuarios/${id}`);
    await update(usuarioRef, updates);
  }

  static async delete(id) {
    const usuarioRef = ref(database, `usuarios/${id}`);
    await remove(usuarioRef);
  }

  // --- Métodos específicos para amigos ---
  async addAmigo(amigoId, nickname = null) {
    if (!amigoId) throw new Error('ID do amigo é obrigatório');
    
    this.amigos = this.amigos || {};
    this.amigos[amigoId] = {
      nickname,
      dataAdicao: new Date().toISOString()
    };

    await Usuario.update(this.id, { amigos: this.amigos });
  }

  async removeAmigo(amigoId) {
    if (!this.amigos || !this.amigos[amigoId]) return;
    
    const updatedAmigos = { ...this.amigos };
    delete updatedAmigos[amigoId];
    
    await Usuario.update(this.id, { amigos: updatedAmigos });
    this.amigos = updatedAmigos;
  }

  // --- Métodos para filmes favoritos ---
  async addFavorito(filmeId) {
    this.favoritos = this.favoritos || {};
    this.favoritos[filmeId] = true;
    
    await Usuario.update(this.id, { favoritos: this.favoritos });
  }

  async removeFavorito(filmeId) {
    if (!this.favoritos || !this.favoritos[filmeId]) return;
    
    const updatedFavoritos = { ...this.favoritos };
    delete updatedFavoritos[filmeId];
    
    await Usuario.update(this.id, { favoritos: updatedFavoritos });
    this.favoritos = updatedFavoritos;
  }

  // --- Métodos para filmes assistidos ---
  async addFilme(filmeId, dadosFilme = {}) {
    this.filmes = this.filmes || {};
    this.filmes[filmeId] = {
      ...dadosFilme,
      dataAssistido: dadosFilme.dataAssistido || new Date().toISOString()
    };
    
    await Usuario.update(this.id, { filmes: this.filmes });
  }

  async updateFilme(filmeId, updates) {
    if (!this.filmes || !this.filmes[filmeId]) return;
    
    this.filmes[filmeId] = {
      ...this.filmes[filmeId],
      ...updates
    };
    
    await Usuario.update(this.id, { filmes: this.filmes });
  }

  async removeFilme(filmeId) {
    if (!this.filmes || !this.filmes[filmeId]) return;
    
    const updatedFilmes = { ...this.filmes };
    delete updatedFilmes[filmeId];
    
    await Usuario.update(this.id, { filmes: updatedFilmes });
    this.filmes = updatedFilmes;
  }
}