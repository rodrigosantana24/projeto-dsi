// src/services/auth.js

// Array em memória que armazenará os usuários cadastrados
const users = [
  { nome: "teste", email: "teste@gmail.com", password: "Testee" } // Usuário pré-cadastrado
];

// Mock de cadastro: verifica se e‑mail já existe, senão salva
export function mockSignUp({ nome, email, password }) {
  return new Promise((resolve, reject) => {
    const exists = users.some(u => u.email === email);
    setTimeout(() => {
      if (exists) {
        reject(new Error("E‑mail já cadastrado"));
      } else {
        users.push({ nome, email, password });
        resolve({ response: "ok" });
      }
    }, 1500);
  });
}

// Mock de login: encontra usuário pelo e‑mail e compara senha
export function mockLogin({ email, password }) {
  return new Promise((resolve, reject) => {
    const user = users.find(u => u.email === email && u.password === password);
    setTimeout(() => {
      if (user) {
        resolve({ response: "ok", token: "fake-token-123" });
      } else {
        reject(new Error("Credenciais inválidas"));
      }
    }, 1000);
  });
}
