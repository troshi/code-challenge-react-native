import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Pokemon } from "@/types/pokemon";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface PokemonDetailModalProps {
  visible: boolean;
  pokemon:
    | (Pokemon & {
        id: string;
        imageUrl?: string | null;
        imageUrlArtwork?: string | null;
        detail?: any;
      })
    | null;
  loading: boolean;
  onClose: () => void;
}

export default function PokemonDetailModal({
  visible,
  pokemon,
  loading,
  onClose,
}: PokemonDetailModalProps) {
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕ Close</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {loading || !pokemon?.detail ? (
          <ThemedView style={styles.centerContainer}>
            <ThemedText style={styles.loadingText}>
              Loading Pokémon details...
            </ThemedText>
          </ThemedView>
        ) : (
          <ScrollView style={styles.modalContent}>
            <ThemedView style={styles.pokemonDetail}>
              <ThemedText type="title" style={styles.pokemonDetailName}>
                {capitalize(pokemon.name)}
              </ThemedText>
              <ThemedText style={styles.pokemonDetailId}>
                #{pokemon.id.padStart(3, "0")}
              </ThemedText>

              {pokemon.imageUrlArtwork && (
                <Image
                  source={{ uri: pokemon.imageUrlArtwork }}
                  style={styles.pokemonDetailImage}
                  resizeMode="contain"
                />
              )}

              <ThemedView style={styles.detailSection}>
                <ThemedView style={styles.detailRow}>
                  <ThemedText type="subtitle">Height:</ThemedText>
                  <ThemedText>{pokemon.detail.height / 10} m</ThemedText>
                </ThemedView>

                <ThemedView style={styles.detailRow}>
                  <ThemedText type="subtitle">Weight:</ThemedText>
                  <ThemedText>{pokemon.detail.weight / 10} kg</ThemedText>
                </ThemedView>

                <ThemedView style={styles.detailRow}>
                  <ThemedText type="subtitle">Types:</ThemedText>
                  <ThemedView style={styles.typesContainer}>
                    {pokemon.detail.types.map((typeInfo: any) => (
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
                    {pokemon.detail.abilities.map((abilityInfo: any) => (
                      <View
                        key={abilityInfo.ability.name}
                        style={styles.abilityBadge}
                      >
                        <ThemedText style={styles.abilityText}>
                          {capitalize(abilityInfo.ability.name)}
                        </ThemedText>
                      </View>
                    ))}
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.detailRow}>
                  <ThemedText type="subtitle">Base Stats:</ThemedText>
                </ThemedView>
                {pokemon.detail.stats.map((stat: any) => (
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
  );
}

const styles = StyleSheet.create({
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
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
