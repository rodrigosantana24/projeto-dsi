import { useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../configs/firebaseConfig';
import Filme from '../models/Filme';

export function useMovieDetailsController(navigation, route) {
  const [filme, setFilme] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const configurarLayout = () => {
    navigation.setOptions({ 
      headerTitle: 'Detalhes do Filme',
      headerBackTitleVisible: false,
      headerTintColor: 'white',
    });
  };

  const carregarFilme = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      const filmeId = route.params?.id;
      if (!filmeId) throw new Error('ID do filme não fornecido');
      
      const filmeRef = ref(database, `filmes/${filmeId}`);
      const snapshot = await get(filmeRef);
      
      if (!snapshot.exists()) {
        throw new Error('Filme não encontrado');
      }
      
      setFilme(Filme.fromFirebase(filmeId, snapshot.val()));
      
    } catch (error) {
      console.error("Erro ao carregar filme:", error);
      setErro("Não foi possível carregar os detalhes do filme. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const getGeneros = () => {
    if (!filme?.genero) return [];
    return filme.genero.split('-');
  };

  return {
    filme,
    carregando,
    erro,
    configurarLayout,
    carregarFilme,
    getGeneros,
    getImagem: () => filme?.getImageUrl() || null,
    getDescricao: () => filme?.overview || 'Descrição não disponível'
  };
}