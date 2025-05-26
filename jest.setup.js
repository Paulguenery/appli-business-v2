import '@testing-library/jest-dom';

// Mock pour les fonctionnalités non disponibles dans l'environnement de test
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

// Mock pour localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock pour les fonctionnalités de Leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn(() => null),
  TileLayer: jest.fn(() => null),
  Circle: jest.fn(() => null),
  Marker: jest.fn(() => null),
  useMap: jest.fn(() => ({
    setView: jest.fn(),
  })),
}));

jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
    },
    mergeOptions: jest.fn(),
  },
}));