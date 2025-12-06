// Mapbox Configuration
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
export const TOLLGURU_API_KEY = import.meta.env.VITE_TOLLGURU_API_KEY;
export const OSRM_SERVER_URL = import.meta.env.VITE_OSRM_SERVER_URL || 'https://router.project-osrm.org';
export const ENABLE_OSRM_FALLBACK = import.meta.env.VITE_ENABLE_OSRM_FALLBACK === 'true';

// Map Settings
export const DEFAULT_MAP_CENTER = [-98.5795, 39.8283]; // Center of continental US
export const DEFAULT_MAP_ZOOM = 4;
export const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';

export const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-streets-v12',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
};

// Route Colors
export const ROUTE_COLORS = {
  PRIMARY: '#667eea',
  ALTERNATIVE_1: '#48bb78',
  ALTERNATIVE_2: '#f6ad55',
  ALTERNATIVE_3: '#fc8181',
  SELECTED: '#2d3748',
  OVER_BUDGET: '#e53e3e',
};

// Toll Budget Presets
export const TOLL_BUDGET_PRESETS = [
  { label: 'No Tolls', value: 0 },
  { label: '$5', value: 5 },
  { label: '$10', value: 10 },
  { label: '$20', value: 20 },
  { label: '$50', value: 50 },
  { label: 'Unlimited', value: Infinity },
];

// Routing Modes
export const ROUTING_MODES = {
  FASTEST: 'fastest',
  SHORTEST: 'shortest',
  CHEAPEST: 'cheapest',
};

// API Endpoints
export const MAPBOX_API = {
  GEOCODING: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  DIRECTIONS: 'https://api.mapbox.com/directions/v5/mapbox/driving',
  MATRIX: 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving',
};

export const TOLLGURU_API = {
  BASE_URL: 'https://apis.tollguru.com/toll/v2',
  ROUTE: 'https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service',
};

// Cache Settings
export const CACHE_DURATION = {
  GEOCODING: 1000 * 60 * 60 * 24, // 24 hours
  ROUTES: 1000 * 60 * 30, // 30 minutes
  TOLL_DATA: 1000 * 60 * 60, // 1 hour
};

// Local Storage Keys
export const STORAGE_KEYS = {
  PREFERENCES: 'tollsmap_preferences',
  RECENT_SEARCHES: 'tollsmap_recent_searches',
  ROUTE_CACHE: 'tollsmap_route_cache',
};

// Default User Preferences
export const DEFAULT_PREFERENCES = {
  maxTollBudget: 20,
  routingMode: ROUTING_MODES.FASTEST,
  avoidHighways: false,
  avoidTolls: false,
  mapStyle: DEFAULT_MAP_STYLE,
};

// Animation Durations (ms)
export const ANIMATION = {
  MAP_FLY_DURATION: 1500,
  ROUTE_FADE_IN: 500,
  PANEL_TRANSITION: 300,
};
