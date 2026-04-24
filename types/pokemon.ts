export interface Pokemon {
  id: number;
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: Pokemon[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  imageUrl: string | null;
  largeImageUrl: string | null;
}
