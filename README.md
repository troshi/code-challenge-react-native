# Pokemon App - React Native Challenge

Aplicación React Native que consume la PokeAPI, mostrando una lista de Pokémon con búsqueda en tiempo real y detalles en modal.

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Expo CLI (se instala automáticamente con las dependencias)
- Para móvil: Expo Go app (iOS/Android) o emulador/simulador configurado

## Instalación

```bash
# Instalar dependencias
npm install

# Para iOS (solo macOS)
cd ios && pod install && cd ..
```

## Ejecutar la Aplicación

```bash
# Iniciar el servidor de desarrollo
npm start

# Luego presiona:
# - 'a' para Android emulator
# - 'i' para iOS simulator
# - 'w' para navegador web
# - Escanea el QR con Expo Go en tu dispositivo físico
```

## Ejecutar las Pruebas

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm test -- --watch

# Ejecutar tests con cobertura
npm test -- --coverage
```

## Estructura del Proyecto

```
code-challenge-react-native/
├── app/
│   └── (tabs)/
│       └── pokemon.tsx       # Pantalla principal de Pokémon
├── services/
│   └── pokemonApi.ts         # Capa de servicio para la API
├── types/
│   └── pokemon.ts            # Tipos TypeScript
├── __tests__/
│   └── PokemonScreen.test.tsx # Pruebas unitarias
├── jest.config.js            # Configuración de Jest
└── jest.setup.js             # Setup de tests
```

## Enfoque de Implementación

### 1. Arquitectura

Se implementó una arquitectura en capas:

- **Services**: `pokemonApi.ts` contiene las funciones para consumir la API, separando la lógica de red de la UI.
- **Types**: Definiciones TypeScript para los datos de Pokémon, proporcionando type-safety en toda la aplicación.
- **Screens**: Componente principal con toda la lógica de presentación y estado.

### 2. Funcionalidades Implementadas

#### Lista de Pokémon
- Carga inicial de 20 Pokémon desde PokeAPI
- FlatList con 2 columnas para diseño responsivo
- Pull-to-refresh para actualizar la lista
- Botón flotante para recargar

#### Búsqueda en Tiempo Real
- Filtrado por nombre con búsqueda case-insensitive
- Estado vacío cuando no hay resultados
- Debounce natural mediante el ciclo de renderizado de React

#### Modal de Detalles
- Muestra imagen grande (official artwork)
- Nombre, ID, tipos, peso y altura
- Badges de tipos con colores oficiales
- Manejo de estados de carga y error
- Cierre con botón X o tocando fuera

#### Manejo de Estados
- **Loading**: Spinner inicial mientras carga
- **Error**: Mensaje con botón de retry
- **Empty**: Mensaje cuando no hay resultados
- **Refreshing**: Indicador durante pull-to-refresh

### 3. Decisiones de Diseño

- **StyleSheet nativo**: Se usó StyleSheet de React Native en lugar de styled-components para mantener la simplicidad y el rendimiento nativo.
- **Colores**: Paleta moderna con tonos grises (Tailwind-inspired) y azul para acciones principales.
- **Tipografía**: San Francisco (nativa de iOS) con pesos semibold/bold para jerarquía.
- **Espaciado**: Padding consistente de 16px, bordes redondeados de 12-24px.

### 4. Pruebas Unitarias

Las pruebas cubren:

1. **Renderizado inicial**: Verifica estado de carga y renderizado exitoso
2. **Búsqueda**: Filtrado, case-insensitivity, estado vacío
3. **Error handling**: Errores de API y retry
4. **Modal**: Apertura, carga de detalles, cierre, errores
5. **Refresh**: Pull-to-refresh y botón flotante

### 5. Consumo de la API

- **Endpoint**: `https://pokeapi.co/api/v2/pokemon/`
- **Paginación**: Limit y offset para controlar la carga
- **Sprites**: `front_default` para lista, `official-artwork` para modal
- **Fetch nativo**: Sin librerías adicionales

### 6. TypeScript

Todo el código está tipado con TypeScript:

- Interfaces para Pokemon, PokemonDetail, PokemonListResponse
- Props de componentes tipados
- Funciones con tipos de retorno explícitos

## Extras Implementados

- [x] TypeScript
- [x] Diseño limpio y consistente
- [x] Manejo completo de errores
- [x] Estados de carga y refresh
- [x] Tests unitarios comprehensivos
- [x] Tipos de Pokémon con colores oficiales
- [x] IDs formateados (#001, #025, etc.)

## Comandos Útiles

```bash
# Limpiar cache de Expo
npm start -- --clear

# Ejecutar linter
npm run lint

# Resetear proyecto a estado inicial
npm run reset-project
```

## Solución de Problemas

### Error: "Module not found"
```bash
npm install
```

### Error: "Metro bundler not starting"
```bash
npm start -- --clear
```

### Tests no encuentran los componentes
Asegúrate de que Jest esté configurado correctamente:
```bash
npm test -- --clearCache
```

## Recursos

- [PokeAPI Documentation](https://pokeapi.co/docs/v2)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Expo Documentation](https://docs.expo.dev/)
