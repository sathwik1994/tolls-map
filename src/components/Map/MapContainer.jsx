import { useCallback, useState, useEffect } from 'react';
import Map, { NavigationControl, GeolocateControl, ScaleControl, Marker } from 'react-map-gl';
import { useMap } from '../../contexts/MapContext';
import { useRoute } from '../../contexts/RouteContext';
import RouteLayer from './RouteLayer';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, DEFAULT_MAP_STYLE } from '../../utils/constants';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapContainer.css';

function MapContainer() {
  const { mapInstance, setMapInstance, viewState, setViewState, mapStyle } = useMap();
  const { routes } = useRoute();
  const [cursor, setCursor] = useState('auto');
  const [currentLocation, setCurrentLocation] = useState(null);

  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setCurrentLocation([longitude, latitude]);
          // Update map view to current location
          setViewState({
            longitude,
            latitude,
            zoom: 12,
          });
        },
        (error) => {
          console.log('Unable to get current location:', error.message);
          // Continue with default location
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, [setViewState]);

  // Fit map bounds to show all routes when they're loaded
  useEffect(() => {
    if (mapInstance && routes && routes.length > 0) {
      try {
        // Combine all route geometries
        const allCoordinates = routes.flatMap((route) =>
          route.geometry.coordinates
        );

        if (allCoordinates.length > 0) {
          // Calculate bounds using turf
          const line = turf.lineString(allCoordinates);
          const bbox = turf.bbox(line);

          // Fit to bounds with padding
          mapInstance.fitBounds(
            [
              [bbox[0], bbox[1]],
              [bbox[2], bbox[3]],
            ],
            {
              padding: { top: 100, bottom: 100, left: 450, right: 100 },
              duration: 1500,
            }
          );
        }
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  }, [mapInstance, routes]);

  const onMapLoad = useCallback(
    (event) => {
      setMapInstance(event.target);
    },
    [setMapInstance]
  );

  const onMove = useCallback(
    (evt) => {
      setViewState(evt.viewState);
    },
    [setViewState]
  );

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);

  // Check if Mapbox token is configured
  if (!mapboxToken || mapboxToken === 'your_mapbox_token_here') {
    return (
      <div className="map-container map-error">
        <div className="error-message">
          <h3>Mapbox Token Required</h3>
          <p>Please add your Mapbox access token to the <code>.env</code> file:</p>
          <pre>VITE_MAPBOX_ACCESS_TOKEN=your_token_here</pre>
          <p>
            Get your free token at:{' '}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://account.mapbox.com/access-tokens/
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <Map
        {...viewState}
        onMove={onMove}
        onLoad={onMapLoad}
        mapboxAccessToken={mapboxToken}
        mapStyle={mapStyle || DEFAULT_MAP_STYLE}
        cursor={cursor}
        style={{ width: '100%', height: '100%' }}
        initialViewState={{
          longitude: DEFAULT_MAP_CENTER[0],
          latitude: DEFAULT_MAP_CENTER[1],
          zoom: DEFAULT_MAP_ZOOM,
        }}
      >
        {/* Navigation Controls (Zoom, Rotate) */}
        <NavigationControl position="top-right" />

        {/* Geolocate Control (Find My Location) */}
        <GeolocateControl
          position="top-right"
          trackUserLocation
          showUserHeading
        />

        {/* Scale Control */}
        <ScaleControl position="bottom-right" />

        {/* Route Layer */}
        <RouteLayer />

        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            longitude={currentLocation[0]}
            latitude={currentLocation[1]}
            anchor="bottom"
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#4285F4',
                border: '3px solid white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            />
          </Marker>
        )}
      </Map>
    </div>
  );
}

export default MapContainer;
