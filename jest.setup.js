// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: jest.fn(),
  },
}));

// Mock expo constants
jest.mock('expo-constants', () => ({
  default: {
    platform: {
      os: 'android',
      osVersion: '13',
    },
  },
}));

// Mock expo image
jest.mock('expo-image', () => ({
  default: jest.fn(),
}));
