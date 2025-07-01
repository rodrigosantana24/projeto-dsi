import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMovieDetailsController } from '../controllers/useMovieDetailsController';
import HeaderBar from '../components/navi/HeaderBar';
import { getAuth } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { database } from '../configs/firebaseConfig';

export default function MovieDetailsScreen({ navigation, route }) {
  const {
    filme,
    carregando,
    erro,
    configurarLayout,
    carregarFilme,
    getGeneros,
    getImagem,
    getDescricao
  } = useMovieDetailsController(navigation, route);

  const [isFavorite, setIsFavorite] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const init = async () => {
      await carregarFilme();
      configurarLayout();
      await checkIfFavorite();
    };
    init();
  }, []);

  const checkIfFavorite = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const favRef = ref(database, `usuarios/${user.uid}/favoritos`);
    const snap = await get(favRef);
    if (snap.exists()) {
      const favs = Array.isArray(snap.val()) ? snap.val() : Object.values(snap.val());
      setIsFavorite(favs.includes(route.params.id));
    }
  };

  const toggleFavorite = async () => {
    setToggling(true);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.warn('Usuário não autenticado');
      setToggling(false);
      return;
    }

    const favRef = ref(database, `usuarios/${user.uid}/favoritos`);
    const snap = await get(favRef);
    let favs = snap.exists()
      ? Array.isArray(snap.val()) ? snap.val() : Object.values(snap.val())
      : [];

    if (isFavorite) {
      favs = favs.filter(id => id !== route.params.id);
    } else {
      favs.push(route.params.id);
    }

    await set(favRef, favs);
    setIsFavorite(!isFavorite);
    setToggling(false);
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}Add commentMore actions
      contentContainerStyle={{ paddingBottom: 32 }} 
      >
      <HeaderBar
        title="Detalhes"
        onBack={() => navigation.goBack()}
      />

      {filme ? (
        <>
          <Image source={{ uri: getImagem() }} style={styles.poster} />

          <View style={styles.titleRow}>
            <Text style={styles.title}>{filme.title}</Text>

            <TouchableOpacity onPress={toggleFavorite} disabled={toggling}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={35}
                color="red"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{filme.release_date}</Text>
            <Text style={styles.metaText}>{filme.runtime} min</Text>
            <Text style={styles.metaText}>{filme.original_language.toUpperCase()}</Text>
            <Text style={styles.metaText}>
                  {filme.vote_average.toFixed(2)} ★
                </Text>
          </View>

          <View style={styles.genresContainer}>
            {getGeneros().map((genre, i) => (
              <View key={i} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.trim()}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Sinopse</Text>
            <Text style={styles.description}>{getDescricao()}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Elenco</Text>
            <Text style={styles.infoText}>{filme.credits}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Orçamento</Text>
            <Text style={styles.infoText}>
              ${filme.budget.toLocaleString()}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>{erro}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#072330',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  poster: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  metaText: {
    color: '#f4a03f',
    fontSize: 14,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  genreTag: {
    backgroundColor: '#333',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  genreText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    color: '#FFF',
    fontSize: 14,
  },
  infoBox: {
    marginTop: 6,
    padding: 12,
    backgroundColor: '#113342',
    borderRadius: 8,
  },
  infoTitle: {
    color: '#f4a03f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#FFF',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
