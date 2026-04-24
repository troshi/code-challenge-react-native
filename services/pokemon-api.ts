import { Pokemon, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit: number = 151, offset: number = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list');
  }
  
  return await response.json();
}

export async function fetchPokemonDetail(name: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon details for ${name}`);
  }
  
  return await response.json();
}
