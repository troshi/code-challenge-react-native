import { getPokemonList, getPokemonDetails, getPokemonDetailsByUrl } from '@/services/pokemonApi';
import { PokemonListResponse, PokemonDetail } from '@/types/pokemon';

describe('Pokemon API Service', () => {
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPokemonList', () => {
    it('fetches Pokemon list with default parameters', async () => {
      const mockResponse: PokemonListResponse = {
        results: [
          { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { id: 4, name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        ],
        count: 100,
        next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
        previous: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
          ],
          count: 100,
          next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
          previous: null,
        }),
      });

      const result = await getPokemonList();

      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
      expect(result.results).toHaveLength(2);
      expect(result.results[0].name).toBe('bulbasaur');
      expect(result.results[0].id).toBe(1);
      expect(result.results[1].name).toBe('charmander');
      expect(result.results[1].id).toBe(2);
    });

    it('fetches Pokemon list with custom limit and offset', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
          count: 100,
          next: null,
          previous: null,
        }),
      });

      await getPokemonList(1, 24);

      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=1&offset=24');
    });

    it('throws error when API returns non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getPokemonList()).rejects.toThrow('Failed to fetch Pokemon list');
    });

    it('assigns sequential IDs starting from offset + 1', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon/133/' },
            { name: 'snorlax', url: 'https://pokeapi.co/api/v2/pokemon/143/' },
          ],
          count: 100,
          next: null,
          previous: null,
        }),
      });

      const result = await getPokemonList(2, 132);

      expect(result.results[0].id).toBe(133);
      expect(result.results[1].id).toBe(134);
    });
  });

  describe('getPokemonDetails', () => {
    const mockPokemonData = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        other: {
          'official-artwork': {
            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
          },
        },
      },
    };

    it('fetches Pokemon details by name', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonData,
      });

      const result = await getPokemonDetails('bulbasaur');

      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/bulbasaur');
      expect(result.name).toBe('bulbasaur');
      expect(result.height).toBe(7);
      expect(result.weight).toBe(69);
      expect(result.types).toEqual(['grass', 'poison']);
    });

    it('fetches Pokemon details by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonData,
      });

      await getPokemonDetails(1);

      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1');
    });

    it('extracts large image from official artwork', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonData,
      });

      const result = await getPokemonDetails('bulbasaur');

      expect(result.largeImageUrl).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
      );
    });

    it('falls back to front_default when official artwork is missing', async () => {
      const mockDataWithoutOfficialArtwork = {
        ...mockPokemonData,
        sprites: {
          ...mockPokemonData.sprites,
          other: {},
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDataWithoutOfficialArtwork,
      });

      const result = await getPokemonDetails('bulbasaur');

      expect(result.largeImageUrl).toBe(
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
      );
    });

    it('throws error when fetching details fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getPokemonDetails('invalid-pokemon')).rejects.toThrow(
        'Failed to fetch Pokemon details for invalid-pokemon'
      );
    });
  });

  describe('getPokemonDetailsByUrl', () => {
    const mockPokemonData = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      types: [{ type: { name: 'electric' } }],
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        other: {
          'official-artwork': {
            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
          },
        },
      },
    };

    it('fetches Pokemon details using full URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonData,
      });

      const result = await getPokemonDetailsByUrl('https://pokeapi.co/api/v2/pokemon/25/');

      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25/');
      expect(result.name).toBe('pikachu');
      expect(result.types).toEqual(['electric']);
    });

    it('throws error when URL fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        getPokemonDetailsByUrl('https://pokeapi.co/api/v2/pokemon/999/')
      ).rejects.toThrow('Failed to fetch Pokemon details from URL');
    });
  });
});
