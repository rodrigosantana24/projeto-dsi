import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import BottomTab from '../components/navi/BottomTab';
import { Logo } from '../components/logo/Logo';
import SearchBar from '../components/search/SearchBar';
import SectionCarousel from '../components/carousels/SectionCarousel';
import FeaturedCarousel from '../components/carousels/FeaturedCarousel';
import FilterChips from '../components/chips/FilterChips';
import { database } from '../configs/firebaseConfig';
import { ref, onValue, query, limitToFirst } from 'firebase/database';

const filtros = ['Ação', 'Comédia', 'Terror', 'Romance', 'Suspense', 'Drama'];



export default function HomeScreen({ navigation }) {
    // Estados para armazenar os filmes vindos do Firebase
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [suggestedMovies, setSuggestedMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerBackVisible: false,
        });
    }, [navigation]);

    // useEffect para buscar os dados quando o componente montar
    useEffect(() => {
        const moviesRef = ref(database, 'movies/');

        const unsubscribe = onValue(moviesRef, (snapshot) => {
            const data = snapshot.val();
            if (data && typeof data === 'object') {
                const allMovies = Object.keys(data).map(key => {
                    const movie = data[key];
                    return {
                        id: movie.id || key,
                        title: movie.title,
                        genres: movie.genres || [],
                        image: { uri: movie.poster_path }
                    }
                });

                // Simplesmente divide a lista de filmes para os carrosséis
                setFeaturedMovies(allMovies.slice(0, 10));
                setPopularMovies(allMovies.slice(10, 20));
                setSuggestedMovies(allMovies.slice(20, 30));
                
                setLoading(false);
            } else {
                setLoading(false);
            }
        }, (error) => {
            // Callback de erro, pode ser usado para tratar falhas de permissão etc.
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleViewAll = (theme) => {
        console.log(`Ver todos os filmes em: ${theme}`);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Encontre seu filme preferido!</Text>
                    <Logo style={{ width: 75, height: 75 }} />
                </View>
                <View style={styles.body}>
                    <SearchBar />
                    <FilterChips
                        filters={filtros}
                        onSelect={(filter) => console.log('Filtro selecionado:', filter)}
                    />
                    {featuredMovies.length === 0 && popularMovies.length === 0 && suggestedMovies.length === 0 ? (
                        <Text style={styles.noMoviesText}>Nenhum filme encontrado no momento.</Text>
                    ) : (
                        <>
                            {featuredMovies.length > 0 && <FeaturedCarousel data={featuredMovies} />}
                            {popularMovies.length > 0 && (
                                <SectionCarousel
                                    title="Populares"
                                    data={popularMovies}
                                    onViewAll={() => handleViewAll('Populares')}
                                    contentContainerStyle={{ paddingLeft: 0 }}
                                />
                            )}
                            {suggestedMovies.length > 0 && (
                                <SectionCarousel
                                    title="Sugestões para você"
                                    data={suggestedMovies}
                                    onViewAll={() => handleViewAll('Sugestões para você')}
                                    contentContainerStyle={{ paddingLeft: 0 }}
                                />
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <BottomTab />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#192936'
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: -10,
        zIndex: 1,
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: -15,
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 70,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    noMoviesText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});