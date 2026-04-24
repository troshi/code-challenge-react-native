import PokemonDetailModal from "@/components/PokemonDetailModal";
import PokemonListItem from "@/components/PokemonListItem";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { fetchPokemonDetail, fetchPokemonList } from "@/services/pokemon-api";
import { Pokemon } from "@/types/pokemon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface PokemonWithImage extends Pokemon {
  imageUrl: string | null;
  imageUrlArtwork: string | null;
  id: string;
  detail?: any;
}

const ITEMS_PER_PAGE = 20;

export default function PokemonListScreen() {
  const [pokemonList, setPokemonList] = useState<PokemonWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPokemon, setSelectedPokemon] =
    useState<PokemonWithImage | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    loadPokemon(true);
  }, []);

  useEffect(() => {
    if (refreshing) {
      const animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      animation.start();
      return () => animation.stop();
    } else {
      spinValue.setValue(0);
    }
  }, [refreshing]);

  const loadPokemon = async (reset: boolean = false) => {
    try {
      setError(null);
      const currentOffset = reset ? 0 : offset;
      const data = await fetchPokemonList(ITEMS_PER_PAGE, currentOffset);

      // Fetch images for each Pokémon
      const pokemonWithImages = await Promise.all(
        data.results.map(async (pokemon) => {
          const id = getPokemonId(pokemon.url);
          try {
            const detail = await fetchPokemonDetail(pokemon.name);
            return {
              ...pokemon,
              id,
              imageUrl: detail.sprites.front_default,
              imageUrlArtwork:
                detail.sprites.other["official-artwork"].front_default,
            };
          } catch {
            return {
              ...pokemon,
              id,
              imageUrl: null,
              imageUrlArtwork: null,
            };
          }
        }),
      );

      if (reset) {
        setPokemonList(pokemonWithImages);
      } else {
        setPokemonList((prev) => [...prev, ...pokemonWithImages]);
      }

      setOffset(currentOffset + ITEMS_PER_PAGE);
      setHasMore(!!data.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    await loadPokemon(true);
    setRefreshing(false);
  };

  const onLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadPokemon(false);
    }
  };

  const getPokemonId = (url: string): string => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  };

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handlePokemonPress = async (pokemon: PokemonWithImage) => {
    setModalLoading(true);
    setSelectedPokemon(pokemon);

    // If we don't have details yet, fetch them
    if (!pokemon.detail) {
      try {
        const detail = await fetchPokemonDetail(pokemon.name);
        setSelectedPokemon({ ...pokemon, detail });
      } catch (err) {
        console.error("Failed to load Pokémon details:", err);
      }
    }
    setModalLoading(false);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
        <ThemedText style={styles.footerText}>
          Loading more Pokémon...
        </ThemedText>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Loading Pokémon...</ThemedText>
        </ThemedView>
      );
    }

    if (error) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText type="subtitle" style={styles.errorText}>
            Error loading Pokémon
          </ThemedText>
          <ThemedText>{error}</ThemedText>
        </ThemedView>
      );
    }

    return null;
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <PokemonListItem
            pokemon={item}
            onPress={() => handlePokemonPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />

      {/* Floating Refresh Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={onRefresh}
        disabled={refreshing}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: spinValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          }}
        >
          <MaterialIcons name="refresh" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>

      {/* Pokemon Detail Modal */}
      <PokemonDetailModal
        visible={!!selectedPokemon}
        pokemon={selectedPokemon}
        loading={modalLoading}
        onClose={closeModal}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  errorText: {
    marginBottom: 10,
  },
  listContent: {
    padding: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.7,
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
