# Pokémon App - React Native Challenge 🎮

A React Native mobile application built with Expo that displays a comprehensive list of Pokémon from the [PokéAPI](https://pokeapi.co/). This app showcases modern React Native development practices with TypeScript, Expo Router, and a beautiful user interface.

## Features ✨

- **Pokémon List**: Browse through all Pokémon with their official artwork
- **Infinite Scroll**: Automatically loads more Pokémon as you scroll (20 per page)
- **Pull-to-Refresh**: Refresh the Pokémon list with a simple pull gesture
- **Pokémon Details**: Tap on any Pokémon to view detailed information in a modal sheet
- **Dark Mode Support**: Automatically adapts to system theme preferences
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Modern UI**: Beautiful animations, haptic feedback, and smooth transitions

## Tech Stack 🛠️

- **Framework**: [Expo](https://expo.dev) SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: React Native with custom themed components
- **API**: [PokéAPI](https://pokeapi.co/) - RESTful Pokémon API
- **Animations**: React Native Reanimated
- **Icons**: @expo/vector-icons

## Project Structure 📁

```
app/                          # App screens (file-based routing)
  _layout.tsx                 # Root layout
  (tabs)/                     # Tab-based navigation
    _layout.tsx               # Tabs layout
    index.tsx                 # Home screen (Pokémon list)
    explore.tsx               # Example screen
    pokemon-list.tsx          # Main Pokémon list screen
  modal.tsx                   # Modal screen

components/                   # Reusable UI components
  PokemonListItem.tsx         # Individual Pokémon item
  PokemonDetailModal.tsx      # Pokémon detail modal
  themed-text.tsx             # Themed text component
  themed-view.tsx             # Themed view component
  external-link.tsx           # External link handler
  parallax-scroll-view.tsx    # Parallax scrolling component
  ui/                         # UI components
    collapsible.tsx           # Collapsible section
    icon-symbol.tsx           # Icon components

services/                     # API services
  pokemon-api.ts              # PokéAPI integration

types/                        # TypeScript type definitions
  pokemon.ts                  # Pokémon data types

constants/                    # App constants
  theme.ts                    # Theme configuration

hooks/                        # Custom React hooks
  use-color-scheme.ts         # Color scheme detection
  use-theme-color.ts          # Theme color hook
```

## Get Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository and navigate to the project folder:

   ```bash
   cd code-challenge-react-native
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
   - **Android Emulator**: Press `a` in the terminal or run `npm run android`
   - **Web Browser**: Press `w` in the terminal or run `npm run web`
   - **Expo Go**: Scan the QR code with the Expo Go app

## Available Scripts 📝

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality
- `npm run reset-project` - Reset the project to a clean state

## API Integration 🔌

The app fetches data from the [PokéAPI](https://pokeapi.co/):

- **Pokémon List**: Fetches paginated list of Pokémon (limit: 20 per page)
- **Pokémon Details**: Retrieves detailed information including:
  - Official artwork and sprites
  - Types and abilities
  - Height and weight
  - Base stats
  - And more!

## Key Features Implementation 💡

### Infinite Scroll

The app implements infinite scrolling using a `FlatList` component with automatic pagination. When you reach the end of the list, more Pokémon are automatically loaded.

### Pull-to-Refresh

A custom animated refresh indicator allows you to refresh the Pokémon list by pulling down.

### Modal Details

When tapping on a Pokémon, a detailed modal sheet appears with comprehensive information, presented as a native page sheet on iOS.

### Themed Components

The app supports both light and dark modes with custom themed components that automatically adapt to system preferences.

## Learn More 📚

To learn more about the technologies used in this project:

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [PokéAPI Documentation](https://pokeapi.co/docs/v2)

## Project Reset 🔄

When you're ready to start fresh, run:

```bash
npm run reset-project
```

This command will move the current app code to the **app-example** directory and create a blank **app** directory for new development.

## Join the Community 🌟

Connect with other developers:

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord Community](https://chat.expo.dev)
- [React Native Community](https://github.com/facebook/react-native)

## License 📄

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Expo and React Native**
