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
    Image,
    Modal,
    RefreshControl,
    ScrollView,
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
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePokemonPress(item)}
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.pokemonImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ThemedText style={styles.placeholderText}>
                  #{item.id.padStart(3, "0")}
                </ThemedText>
              </View>
            )}
            <ThemedText style={styles.pokemonName}>
              {capitalize(item.name)}
            </ThemedText>
          </TouchableOpacity>
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
          <MaterialIcons name="refresh" size={24} color="black" />
        </Animated.View>
      </TouchableOpacity>

      {/* Pokemon Detail Modal */}
      <Modal
        visible={!!selectedPokemon}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>✕ Close</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {modalLoading || !selectedPokemon?.detail ? (
            <ThemedView style={styles.centerContainer}>
              <ActivityIndicator size="large" />
              <ThemedText style={styles.loadingText}>
                Loading Pokémon details...
              </ThemedText>
            </ThemedView>
          ) : (
            <ScrollView style={styles.modalContent}>
              <ThemedView style={styles.pokemonDetail}>
                <ThemedText type="title" style={styles.pokemonDetailName}>
                  {capitalize(selectedPokemon.name)}
                </ThemedText>
                <ThemedText style={styles.pokemonDetailId}>
                  #{selectedPokemon.id.padStart(3, "0")}
                </ThemedText>

                {selectedPokemon.imageUrlArtwork && (
                  <Image
                    source={{ uri: selectedPokemon.imageUrlArtwork }}
                    style={styles.pokemonDetailImage}
                    resizeMode="contain"
                  />
                )}

                <ThemedView style={styles.detailSection}>
                  <ThemedView style={styles.detailRow}>
                    <ThemedText type="subtitle">Height:</ThemedText>
                    <ThemedText>
                      {selectedPokemon.detail.height / 10} m
                    </ThemedText>
                  </ThemedView>

                  <ThemedView style={styles.detailRow}>
                    <ThemedText type="subtitle">Weight:</ThemedText>
                    <ThemedText>
                      {selectedPokemon.detail.weight / 10} kg
                    </ThemedText>
                  </ThemedView>

                  <ThemedView style={styles.detailRow}>
                    <ThemedText type="subtitle">Types:</ThemedText>
                    <ThemedView style={styles.typesContainer}>
                      {selectedPokemon.detail.types.map((typeInfo: any) => (
                        <View key={typeInfo.type.name} style={styles.typeBadge}>
                          <ThemedText style={styles.typeText}>
                            {capitalize(typeInfo.type.name)}
                          </ThemedText>
                        </View>
                      ))}
                    </ThemedView>
                  </ThemedView>

                  <ThemedView style={styles.detailRow}>
                    <ThemedText type="subtitle">Abilities:</ThemedText>
                    <ThemedView style={styles.abilitiesContainer}>
                      {selectedPokemon.detail.abilities.map(
                        (abilityInfo: any) => (
                          <View
                            key={abilityInfo.ability.name}
                            style={styles.abilityBadge}
                          >
                            <ThemedText style={styles.abilityText}>
                              {capitalize(abilityInfo.ability.name)}
                            </ThemedText>
                          </View>
                        ),
                      )}
                    </ThemedView>
                  </ThemedView>

                  <ThemedView style={styles.detailRow}>
                    <ThemedText type="subtitle">Base Stats:</ThemedText>
                  </ThemedView>
                  {selectedPokemon.detail.stats.map((stat: any) => (
                    <ThemedView key={stat.stat.name} style={styles.statRow}>
                      <ThemedText style={styles.statName}>
                        {capitalize(stat.stat.name.replace("-", " "))}
                      </ThemedText>
                      <ThemedText style={styles.statValue}>
                        {stat.base_stat}
                      </ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            </ScrollView>
          )}
        </ThemedView>
      </Modal>
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  pokemonImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 40,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    opacity: 0.7,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
  },
  pokemonDetail: {
    padding: 20,
    alignItems: "center",
  },
  pokemonDetailName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pokemonDetailId: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 20,
  },
  pokemonDetailImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  detailSection: {
    width: "100%",
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: 12,
    padding: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  typesContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  typeBadge: {
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  abilitiesContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  abilityBadge: {
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  abilityText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 8,
  },
  statName: {
    fontSize: 14,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});
