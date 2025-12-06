/**
 * Format distance in meters to human-readable string
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const miles = meters * 0.000621371;
  return `${miles.toFixed(1)} mi`;
}

/**
 * Format duration in seconds to human-readable string
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

/**
 * Format currency in cents to dollars
 * @param {number} cents - Amount in cents
 * @returns {string} Formatted currency
 */
export function formatCurrency(cents) {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}

/**
 * Format coordinates to readable string
 * @param {Array} coordinates - [lng, lat]
 * @returns {string} Formatted coordinates
 */
export function formatCoordinates(coordinates) {
  if (!coordinates || coordinates.length !== 2) {
    return 'Invalid coordinates';
  }
  const [lng, lat] = coordinates;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

/**
 * Get route summary text
 * @param {object} route - Route object
 * @returns {string} Summary text
 */
export function getRouteSummary(route) {
  const distance = formatDistance(route.distance);
  const duration = formatDuration(route.duration);
  const toll = route.totalTollCost ? formatCurrency(route.totalTollCost) : 'No tolls';
  return `${distance} • ${duration} • ${toll}`;
}
