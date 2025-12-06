import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { DEFAULT_PREFERENCES, STORAGE_KEYS } from '../utils/constants';

const PreferencesContext = createContext(null);

// Action Types
const SET_MAX_TOLL_BUDGET = 'SET_MAX_TOLL_BUDGET';
const SET_ROUTING_MODE = 'SET_ROUTING_MODE';
const SET_AVOID_HIGHWAYS = 'SET_AVOID_HIGHWAYS';
const SET_AVOID_TOLLS = 'SET_AVOID_TOLLS';
const SET_MAP_STYLE = 'SET_MAP_STYLE';
const LOAD_PREFERENCES = 'LOAD_PREFERENCES';
const RESET_PREFERENCES = 'RESET_PREFERENCES';

// Load preferences from localStorage
function loadPreferencesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

// Save preferences to localStorage
function savePreferencesToStorage(preferences) {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

// Reducer
function preferencesReducer(state, action) {
  switch (action.type) {
    case SET_MAX_TOLL_BUDGET:
      return { ...state, maxTollBudget: action.payload };
    case SET_ROUTING_MODE:
      return { ...state, routingMode: action.payload };
    case SET_AVOID_HIGHWAYS:
      return { ...state, avoidHighways: action.payload };
    case SET_AVOID_TOLLS:
      return { ...state, avoidTolls: action.payload };
    case SET_MAP_STYLE:
      return { ...state, mapStyle: action.payload };
    case LOAD_PREFERENCES:
      return action.payload;
    case RESET_PREFERENCES:
      return DEFAULT_PREFERENCES;
    default:
      return state;
  }
}

// Provider Component
export function PreferencesProvider({ children }) {
  const [state, dispatch] = useReducer(
    preferencesReducer,
    loadPreferencesFromStorage()
  );

  // Save to localStorage whenever preferences change
  useEffect(() => {
    savePreferencesToStorage(state);
  }, [state]);

  const setMaxTollBudget = useCallback((budget) => {
    dispatch({ type: SET_MAX_TOLL_BUDGET, payload: budget });
  }, []);

  const setRoutingMode = useCallback((mode) => {
    dispatch({ type: SET_ROUTING_MODE, payload: mode });
  }, []);

  const setAvoidHighways = useCallback((avoid) => {
    dispatch({ type: SET_AVOID_HIGHWAYS, payload: avoid });
  }, []);

  const setAvoidTolls = useCallback((avoid) => {
    dispatch({ type: SET_AVOID_TOLLS, payload: avoid });
  }, []);

  const setMapStyle = useCallback((style) => {
    dispatch({ type: SET_MAP_STYLE, payload: style });
  }, []);

  const resetPreferences = useCallback(() => {
    dispatch({ type: RESET_PREFERENCES });
  }, []);

  const value = {
    ...state,
    setMaxTollBudget,
    setRoutingMode,
    setAvoidHighways,
    setAvoidTolls,
    setMapStyle,
    resetPreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Custom Hook
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}

export default PreferencesContext;
