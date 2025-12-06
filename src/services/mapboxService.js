import axios from 'axios';
import { MAPBOX_API, MAPBOX_TOKEN } from '../utils/constants';

/**
 * Geocode an address to coordinates
 * @param {string} query - Address or place name to search
 * @param {object} options - Additional options (proximity, bbox, country, types)
 * @returns {Promise<Array>} Array of geocoding results
 */
export async function geocodeAddress(query, options = {}) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const {
    proximity = null, // [lng, lat] to bias results
    bbox = null, // [minLng, minLat, maxLng, maxLat] to limit results
    country = 'us', // Country code(s) to limit results
    types = null, // Filter by place types (e.g., 'place,postcode,address')
    limit = 5,
  } = options;

  try {
    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      limit,
      country,
    });

    if (proximity) {
      params.append('proximity', proximity.join(','));
    }
    if (bbox) {
      params.append('bbox', bbox.join(','));
    }
    if (types) {
      params.append('types', types);
    }

    const url = `${MAPBOX_API.GEOCODING}/${encodeURIComponent(query)}.json?${params}`;
    const response = await axios.get(url);

    return response.data.features.map((feature) => ({
      id: feature.id,
      name: feature.place_name,
      shortName: feature.text,
      coordinates: feature.center, // [lng, lat]
      bbox: feature.bbox,
      placeType: feature.place_type,
      context: feature.context,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to geocode address');
  }
}

/**
 * Reverse geocode coordinates to an address
 * @param {Array} coordinates - [lng, lat]
 * @param {object} options - Additional options
 * @returns {Promise<object>} Geocoding result
 */
export async function reverseGeocode(coordinates, options = {}) {
  if (!coordinates || coordinates.length !== 2) {
    throw new Error('Invalid coordinates');
  }

  const { types = 'address' } = options;

  try {
    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      types,
    });

    const url = `${MAPBOX_API.GEOCODING}/${coordinates[0]},${coordinates[1]}.json?${params}`;
    const response = await axios.get(url);

    if (response.data.features.length === 0) {
      return null;
    }

    const feature = response.data.features[0];
    return {
      id: feature.id,
      name: feature.place_name,
      shortName: feature.text,
      coordinates: feature.center,
      bbox: feature.bbox,
      placeType: feature.place_type,
      context: feature.context,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Failed to reverse geocode coordinates');
  }
}

/**
 * Get driving directions between two or more points
 * @param {Array} coordinates - Array of [lng, lat] coordinates
 * @param {object} options - Routing options
 * @returns {Promise<Array>} Array of route objects
 */
export async function getDirections(coordinates, options = {}) {
  if (!coordinates || coordinates.length < 2) {
    throw new Error('At least 2 coordinates required');
  }

  const {
    alternatives = true,
    steps = true,
    geometries = 'geojson',
    overview = 'full',
    annotations = 'distance,duration',
    exclude = [],
  } = options;

  try {
    const coordinatesString = coordinates.map((coord) => coord.join(',')).join(';');

    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      alternatives: alternatives ? 'true' : 'false',
      steps: steps ? 'true' : 'false',
      geometries,
      overview,
      annotations,
    });

    // Add exclude parameter if provided (e.g., ['toll', 'ferry'])
    if (exclude && exclude.length > 0) {
      params.append('exclude', exclude.join(','));
    }

    const url = `${MAPBOX_API.DIRECTIONS}/${coordinatesString}?${params}`;
    const response = await axios.get(url);

    return response.data.routes.map((route, index) => ({
      id: `route-${index}`,
      geometry: route.geometry,
      distance: route.distance, // meters
      duration: route.duration, // seconds
      legs: route.legs,
      steps: route.legs?.flatMap((leg) => leg.steps || []),
      summary: route.legs?.map((leg) => leg.summary).join(', '),
    }));
  } catch (error) {
    console.error('Directions error:', error);
    throw new Error('Failed to get directions');
  }
}

/**
 * Get current user location using browser Geolocation API
 * @returns {Promise<Array>} [lng, lat] coordinates
 */
export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
