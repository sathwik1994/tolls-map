import { createContext, useContext, useReducer, useCallback } from 'react';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, ANIMATION } from '../utils/constants';

const MapContext = createContext(null);

// Action Types
const SET_MAP_INSTANCE = 'SET_MAP_INSTANCE';
const SET_VIEW_STATE = 'SET_VIEW_STATE';
const SET_BOUNDS = 'SET_BOUNDS';
const SET_MAP_STYLE = 'SET_MAP_STYLE';
const SET_SELECTED_ROUTE = 'SET_SELECTED_ROUTE';

// Initial State
const initialState = {
  mapInstance: null,
  viewState: {
    longitude: DEFAULT_MAP_CENTER[0],
    latitude: DEFAULT_MAP_CENTER[1],
    zoom: DEFAULT_MAP_ZOOM,
  },
  bounds: null,
  mapStyle: 'mapbox://styles/mapbox/streets-v12',
  selectedRouteId: null,
};

// Reducer
function mapReducer(state, action) {
  switch (action.type) {
    case SET_MAP_INSTANCE:
      return { ...state, mapInstance: action.payload };
    case SET_VIEW_STATE:
      return { ...state, viewState: { ...state.viewState, ...action.payload } };
    case SET_BOUNDS:
      return { ...state, bounds: action.payload };
    case SET_MAP_STYLE:
      return { ...state, mapStyle: action.payload };
    case SET_SELECTED_ROUTE:
      return { ...state, selectedRouteId: action.payload };
    default:
      return state;
  }
}

// Provider Component
export function MapProvider({ children }) {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  const setMapInstance = useCallback((mapInstance) => {
    dispatch({ type: SET_MAP_INSTANCE, payload: mapInstance });
  }, []);

  const setViewState = useCallback((viewState) => {
    dispatch({ type: SET_VIEW_STATE, payload: viewState });
  }, []);

  const setBounds = useCallback((bounds) => {
    dispatch({ type: SET_BOUNDS, payload: bounds });
  }, []);

  const setMapStyle = useCallback((style) => {
    dispatch({ type: SET_MAP_STYLE, payload: style });
  }, []);

  const setSelectedRoute = useCallback((routeId) => {
    dispatch({ type: SET_SELECTED_ROUTE, payload: routeId });
  }, []);

  // Map utility functions
  const flyTo = useCallback(
    (coordinates, zoom = 12) => {
      if (state.mapInstance) {
        state.mapInstance.flyTo({
          center: coordinates,
          zoom,
          duration: ANIMATION.MAP_FLY_DURATION,
        });
      }
    },
    [state.mapInstance]
  );

  const fitBounds = useCallback(
    (bounds, options = {}) => {
      if (state.mapInstance) {
        state.mapInstance.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: ANIMATION.MAP_FLY_DURATION,
          ...options,
        });
      }
    },
    [state.mapInstance]
  );

  const value = {
    ...state,
    setMapInstance,
    setViewState,
    setBounds,
    setMapStyle,
    setSelectedRoute,
    flyTo,
    fitBounds,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

// Custom Hook
export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}

export default MapContext;
