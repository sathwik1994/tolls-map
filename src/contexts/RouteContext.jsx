import { createContext, useContext, useReducer, useCallback } from 'react';

const RouteContext = createContext(null);

// Action Types
const SET_ORIGIN = 'SET_ORIGIN';
const SET_DESTINATION = 'SET_DESTINATION';
const SET_ROUTES = 'SET_ROUTES';
const SET_SELECTED_ROUTE = 'SET_SELECTED_ROUTE';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const CLEAR_ROUTES = 'CLEAR_ROUTES';
const SWAP_LOCATIONS = 'SWAP_LOCATIONS';

// Initial State
const initialState = {
  origin: null,
  destination: null,
  routes: [],
  selectedRouteId: null,
  isLoading: false,
  error: null,
};

// Reducer
function routeReducer(state, action) {
  switch (action.type) {
    case SET_ORIGIN:
      return { ...state, origin: action.payload };
    case SET_DESTINATION:
      return { ...state, destination: action.payload };
    case SET_ROUTES:
      return { ...state, routes: action.payload, isLoading: false, error: null };
    case SET_SELECTED_ROUTE:
      return { ...state, selectedRouteId: action.payload };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case CLEAR_ROUTES:
      return { ...state, routes: [], selectedRouteId: null, error: null };
    case SWAP_LOCATIONS:
      return {
        ...state,
        origin: state.destination,
        destination: state.origin,
        routes: [],
        selectedRouteId: null,
      };
    default:
      return state;
  }
}

// Provider Component
export function RouteProvider({ children }) {
  const [state, dispatch] = useReducer(routeReducer, initialState);

  const setOrigin = useCallback((location) => {
    dispatch({ type: SET_ORIGIN, payload: location });
  }, []);

  const setDestination = useCallback((location) => {
    dispatch({ type: SET_DESTINATION, payload: location });
  }, []);

  const setRoutes = useCallback((routes) => {
    dispatch({ type: SET_ROUTES, payload: routes });
  }, []);

  const setSelectedRoute = useCallback((routeId) => {
    dispatch({ type: SET_SELECTED_ROUTE, payload: routeId });
  }, []);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: SET_LOADING, payload: isLoading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: SET_ERROR, payload: error });
  }, []);

  const clearRoutes = useCallback(() => {
    dispatch({ type: CLEAR_ROUTES });
  }, []);

  const swapLocations = useCallback(() => {
    dispatch({ type: SWAP_LOCATIONS });
  }, []);

  const value = {
    ...state,
    setOrigin,
    setDestination,
    setRoutes,
    setSelectedRoute,
    setLoading,
    setError,
    clearRoutes,
    swapLocations,
  };

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

// Custom Hook
export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
}

export default RouteContext;
