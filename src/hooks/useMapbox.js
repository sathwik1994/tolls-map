import { useEffect, useRef, useCallback } from 'react';
import { useMap } from '../contexts/MapContext';
import { MAPBOX_TOKEN, ANIMATION } from '../utils/constants';

/**
 * Hook to manage Mapbox instance and provide utility functions
 */
export function useMapbox() {
  const { mapInstance, setMapInstance, setViewState } = useMap();
  const mapRef = useRef(null);

  /**
   * Fly to a specific location on the map
   */
  const flyTo = useCallback(
    (coordinates, zoom = 12) => {
      if (mapInstance) {
        mapInstance.flyTo({
          center: coordinates,
          zoom,
          duration: ANIMATION.MAP_FLY_DURATION,
        });
      }
    },
    [mapInstance]
  );

  /**
   * Fit the map to specific bounds
   */
  const fitBounds = useCallback(
    (bounds, options = {}) => {
      if (mapInstance) {
        mapInstance.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: ANIMATION.MAP_FLY_DURATION,
          ...options,
        });
      }
    },
    [mapInstance]
  );

  /**
   * Get current map bounds
   */
  const getBounds = useCallback(() => {
    if (mapInstance) {
      return mapInstance.getBounds();
    }
    return null;
  }, [mapInstance]);

  /**
   * Get current map center
   */
  const getCenter = useCallback(() => {
    if (mapInstance) {
      return mapInstance.getCenter();
    }
    return null;
  }, [mapInstance]);

  /**
   * Get current zoom level
   */
  const getZoom = useCallback(() => {
    if (mapInstance) {
      return mapInstance.getZoom();
    }
    return null;
  }, [mapInstance]);

  return {
    mapInstance,
    mapRef,
    setMapInstance,
    setViewState,
    flyTo,
    fitBounds,
    getBounds,
    getCenter,
    getZoom,
    MAPBOX_TOKEN,
  };
}

export default useMapbox;
