import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import PokemonScreen from '@/app/(tabs)/pokemon';

// Mock the API functions
jest.mock('@/services/pokemonApi', () => ({
  getPokemonList: jest.fn(),
  getPokemonDetails: jest.fn(),
}));

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => {
  const View = require('react-native').View;
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Mock Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Dimensions.get = jest.fn(() => ({ width: 400, height: 800 }));
  return RN;
});

const mockPokemonList = {
  results: [
    { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { id: 4, name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { id: 7, name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
    { id: 25, name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  ],
  count: 100,
  next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
  previous: null,
};

const mockPokemonDetails = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  types: ['grass', 'poison'],
  imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  largeImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
};

describe('PokemonScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const pokemonApi = require('@/services/pokemonApi') as typeof import('@/services/pokemonApi');

  describe('Initial Rendering', () => {
    it('shows loading state initially', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );

      render(<PokemonScreen />);

      expect(screen.getByText('Loading Pokemon...')).toBeTruthy();
    });

    it('renders Pokemon list successfully after loading', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });
      expect(screen.getByText('charmander')).toBeTruthy();
      expect(screen.getByText('squirtle')).toBeTruthy();
      expect(screen.getByText('pikachu')).toBeTruthy();
    });

    it('displays Pokemon IDs correctly', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('#001')).toBeTruthy();
      });
      expect(screen.getByText('#004')).toBeTruthy();
      expect(screen.getByText('#007')).toBeTruthy();
      expect(screen.getByText('#025')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('shows error state when API fails', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch Pokemon list')
      );

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch Pokemon list')).toBeTruthy();
      });
      expect(screen.getByText('Retry')).toBeTruthy();
    });

    it('allows retrying after error', async () => {
      (pokemonApi.getPokemonList as jest.Mock)
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce(mockPokemonList);

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('Retry'));

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });
    });
  });

  describe('Search Functionality', () => {
    it('filters Pokemon by name when typing in search box', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });

      const searchInput = screen.getByPlaceholderText('Search Pokemon...');
      fireEvent.changeText(searchInput, 'char');

      await waitFor(() => {
        expect(screen.getByText('charmander')).toBeTruthy();
      });
    });

    it('shows all Pokemon when search is cleared', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });

      const searchInput = screen.getByPlaceholderText('Search Pokemon...');

      fireEvent.changeText(searchInput, 'pika');
      await waitFor(() => {
        expect(screen.getByText('pikachu')).toBeTruthy();
      });

      fireEvent.changeText(searchInput, '');
      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });
    });

    it('shows empty state when no Pokemon matches search', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });

      const searchInput = screen.getByPlaceholderText('Search Pokemon...');
      fireEvent.changeText(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.getByText('No Pokemon found')).toBeTruthy();
      });
    });

    it('searches case-insensitively', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });

      const searchInput = screen.getByPlaceholderText('Search Pokemon...');
      fireEvent.changeText(searchInput, 'CHAR');

      await waitFor(() => {
        expect(screen.getByText('charmander')).toBeTruthy();
      });
    });
  });

  describe('Pokemon Details Modal', () => {
    it('opens modal and displays Pokemon details', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);
      (pokemonApi.getPokemonDetails as jest.Mock).mockResolvedValue(mockPokemonDetails);

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('bulbasaur'));

      await waitFor(() => {
        expect(screen.getByText('grass')).toBeTruthy();
      });
      expect(screen.getByText('poison')).toBeTruthy();
      expect(screen.getByText('0.7 m')).toBeTruthy();
      expect(screen.getByText('6.9 kg')).toBeTruthy();
    });

    it('closes modal when close button is pressed', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);
      (pokemonApi.getPokemonDetails as jest.Mock).mockResolvedValue(mockPokemonDetails);

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('bulbasaur'));

      await waitFor(() => {
        expect(screen.getByText('grass')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('✕'));

      await waitFor(() => {
        expect(screen.queryByText('grass')).toBeNull();
      });
    });

    it('shows error when fetching Pokemon details fails', async () => {
      (pokemonApi.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);
      (pokemonApi.getPokemonDetails as jest.Mock).mockRejectedValue(
        new Error('Failed to load Pokemon details')
      );

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('bulbasaur'));

      await waitFor(() => {
        expect(screen.getByText('Failed to load Pokemon details')).toBeTruthy();
      });
    });
  });

  describe('Floating Reload Button', () => {
    it('refreshes list when floating button is pressed', async () => {
      (pokemonApi.getPokemonList as jest.Mock)
        .mockResolvedValueOnce(mockPokemonList)
        .mockResolvedValueOnce({
          ...mockPokemonList,
          results: [...mockPokemonList.results, { id: 133, name: 'eevee', url: '' }],
        });

      render(<PokemonScreen />);

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('⟳'));

      await waitFor(() => {
        expect(pokemonApi.getPokemonList).toHaveBeenCalledTimes(2);
      });
    });
  });
});
