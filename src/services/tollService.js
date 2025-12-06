import axios from 'axios';
import * as turf from '@turf/turf';
import { TOLLGURU_API } from '../utils/constants';
import tollData from '../data/tollRoads.json';

/**
 * Get toll costs for a route using TollGuru API
 * @param {object} route - Route object with geometry
 * @param {object} options - Additional options
 * @returns {Promise<Array>} Array of toll objects
 */
export async function getTollsForRoute(route, options = {}) {
  const apiKey = import.meta.env.VITE_TOLLGURU_API_KEY;

  // If no API key or it's a placeholder, use offline estimation
  if (!apiKey || apiKey === 'your_tollguru_key_here') {
    console.log('TollGuru API key not configured, using offline estimation');
    return estimateTollsOffline(route);
  }

  try {
    // Convert route geometry to polyline format for TollGuru
    const polyline = route.geometry.coordinates.map(coord => coord.join(',')).join(';');

    const response = await axios.post(
      TOLLGURU_API.ROUTE,
      {
        source: 'mapbox',
        polyline: polyline,
        vehicleType: '2AxlesAuto',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      }
    );

    if (response.data && response.data.route && response.data.route.tolls) {
      return response.data.route.tolls.map((toll, index) => ({
        id: `toll-${route.id}-${index}`,
        name: toll.name || 'Toll Plaza',
        location: toll.lat && toll.lng ? [toll.lng, toll.lat] : null,
        cost: Math.round(toll.tagCost * 100), // Convert to cents
        payment: ['E-ZPass', 'Cash'],
        authority: toll.authority || 'Unknown',
      }));
    }

    // Fallback to offline if API returns no tolls
    return estimateTollsOffline(route);
  } catch (error) {
    console.error('TollGuru API error:', error.message);
    // Fallback to offline estimation
    return estimateTollsOffline(route);
  }
}

/**
 * Estimate toll costs using static database
 * @param {object} route - Route object with geometry
 * @returns {Array} Array of estimated toll objects
 */
export function estimateTollsOffline(route) {
  const tolls = [];
  const routeLine = turf.lineString(route.geometry.coordinates);

  // Check proximity to known toll plazas
  tollData.tollPlazas.forEach((plaza) => {
    const plazaPoint = turf.point(plaza.location);
    const distance = turf.pointToLineDistance(plazaPoint, routeLine, { units: 'meters' });

    // If route passes within 500m of a toll plaza, include it
    if (distance < 500) {
      tolls.push({
        id: plaza.id,
        name: plaza.name,
        location: plaza.location,
        cost: plaza.rates.ezpass, // Use E-ZPass rate
        payment: ['E-ZPass', 'Cash'],
        authority: plaza.authority,
      });
    }
  });

  // If no specific plazas found, estimate based on toll roads
  if (tolls.length === 0) {
    tollData.tollRoads.forEach((road) => {
      // Simple bounds check
      const roadBounds = road.bounds;
      const routeBbox = turf.bbox(routeLine);

      // Check if route intersects with toll road bounds
      const boundsOverlap =
        routeBbox[0] <= roadBounds[1][0] &&
        routeBbox[2] >= roadBounds[0][0] &&
        routeBbox[1] <= roadBounds[1][1] &&
        routeBbox[3] >= roadBounds[0][1];

      if (boundsOverlap) {
        // Estimate cost based on route distance and cost per mile
        const routeDistanceMiles = route.distance * 0.000621371;
        const estimatedCost = Math.round(
          routeDistanceMiles * road.averageCostPerMile
        );

        tolls.push({
          id: `estimated-${road.name.replace(/\s+/g, '-').toLowerCase()}`,
          name: `${road.name} (Estimated)`,
          location: null,
          cost: estimatedCost,
          payment: ['E-ZPass', 'Cash'],
          authority: 'Estimated',
        });
      }
    });
  }

  return tolls;
}

/**
 * Calculate total toll cost for a route
 * @param {Array} tolls - Array of toll objects
 * @returns {number} Total cost in cents
 */
export function calculateTotalTollCost(tolls) {
  if (!tolls || tolls.length === 0) {
    return 0;
  }
  return tolls.reduce((sum, toll) => sum + toll.cost, 0);
}

/**
 * Add toll data to routes
 * @param {Array} routes - Array of route objects
 * @returns {Promise<Array>} Routes with toll data added
 */
export async function enrichRoutesWithTolls(routes) {
  const enrichedRoutes = await Promise.all(
    routes.map(async (route) => {
      const tolls = await getTollsForRoute(route);
      const totalTollCost = calculateTotalTollCost(tolls);

      return {
        ...route,
        tolls,
        totalTollCost,
      };
    })
  );

  return enrichedRoutes;
}
