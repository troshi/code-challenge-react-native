import { ThemedText } from "@/components/themed-text";
import { Pokemon } from "@/types/pokemon";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface PokemonListItemProps {
  pokemon: Pokemon & {
    id: string;
    imageUrl: string | null;
  };
  onPress: () => void;
}

export default function PokemonListItem({
  pokemon,
  onPress,
}: PokemonListItemProps) {
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      {pokemon.imageUrl ? (
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.pokemonImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <ThemedText style={styles.placeholderText}>
            #{pokemon.id.padStart(3, "0")}
          </ThemedText>
        </View>
      )}
      <ThemedText style={styles.pokemonName}>
        {capitalize(pokemon.name)}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
