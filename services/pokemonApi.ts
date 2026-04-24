import { Pokemon, PokemonDetail, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const DEFAULT_LIMIT = 20;

export async function getPokemonList(limit: number = DEFAULT_LIMIT, offset: number = 0): Promise<PokemonListResponse> {
  const url = `${BASE_URL}?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }

  const data = await response.json();
  return {
    results: data.results.map((p: { name: string; url: string }, index: number) => ({
      name: p.name,
      id: offset + index + 1,
      url: p.url,
    })),
    count: data.count,
    next: data.next,
    previous: data.previous,
  };
}

export async function getPokemonDetails(nameOrId: string | number): Promise<PokemonDetail> {
  const url = `${BASE_URL}/${nameOrId}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon details for ${nameOrId}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    imageUrl: data.sprites.front_default,
    largeImageUrl: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
  };
}

export async function getPokemonDetailsByUrl(url: string): Promise<PokemonDetail> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon details from URL');
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    imageUrl: data.sprites.front_default,
    largeImageUrl: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
  };
}
