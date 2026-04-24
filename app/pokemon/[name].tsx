import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchPokemonDetail } from '@/services/pokemon-api';

export default function PokemonDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPokemonDetail();
  }, [name]);

  const loadPokemonDetail = async () => {
    try {
      setError(null);
      const data = await fetchPokemonDetail(name);
      setPokemon(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading Pokémon...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !pokemon) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="subtitle" style={styles.errorText}>
          Error loading Pokémon
        </ThemedText>
        <ThemedText>{error || 'Pokémon not found'}</ThemedText>
      </ThemedView>
    );
  }

  const imageUrl =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.name}>
          {capitalize(pokemon.name)}
        </ThemedText>
        <ThemedText style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</ThemedText>

        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <ThemedView style={styles.infoContainer}>
          <ThemedView style={styles.infoRow}>
            <ThemedText type="subtitle">Height:</ThemedText>
            <ThemedText>{pokemon.height / 10} m</ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText type="subtitle">Weight:</ThemedText>
            <ThemedText>{pokemon.weight / 10} kg</ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText type="subtitle">Types:</ThemedText>
            <ThemedView style={styles.typesContainer}>
              {pokemon.types.map((typeInfo: any) => (
                <View key={typeInfo.type.name} style={styles.typeBadge}>
                  <ThemedText style={styles.typeText}>
                    {capitalize(typeInfo.type.name)}
                  </ThemedText>
                </View>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  errorText: {
    marginBottom: 10,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  id: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
