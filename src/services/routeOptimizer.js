import { ROUTING_MODES } from '../utils/constants';

/**
 * Filter routes by toll budget
 * @param {Array} routes - Array of route objects
 * @param {number} maxBudget - Maximum toll budget in cents (or Infinity)
 * @returns {Array} Filtered routes
 */
export function filterByBudget(routes, maxBudget) {
  if (!routes || routes.length === 0) {
    return [];
  }

  // If budget is unlimited (Infinity or null), return all routes
  if (maxBudget === Infinity || maxBudget === null || maxBudget === undefined) {
    return routes.map((route) => ({ ...route, withinBudget: true }));
  }

  return routes.map((route) => ({
    ...route,
    withinBudget: route.totalTollCost <= maxBudget,
  }));
}

/**
 * Rank routes based on user preferences and score them
 * @param {Array} routes - Array of route objects
 * @param {string} routingMode - Routing mode ('fastest', 'shortest', 'cheapest')
 * @returns {Array} Ranked routes with scores
 */
export function rankRoutes(routes, routingMode = ROUTING_MODES.FASTEST) {
  if (!routes || routes.length === 0) {
    return [];
  }

  // Define weights based on routing mode
  const weights = {
    [ROUTING_MODES.FASTEST]: { time: 1.0, distance: 0.3, toll: 0.2 },
    [ROUTING_MODES.SHORTEST]: { time: 0.3, distance: 1.0, toll: 0.2 },
    [ROUTING_MODES.CHEAPEST]: { time: 0.2, distance: 0.3, toll: 1.0 },
  };

  const w = weights[routingMode] || weights[ROUTING_MODES.FASTEST];

  // Normalize values (find min/max for each metric)
  const times = routes.map((r) => r.duration);
  const distances = routes.map((r) => r.distance);
  const tolls = routes.map((r) => r.totalTollCost || 0);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);
  const minToll = Math.min(...tolls);
  const maxToll = Math.max(...tolls);

  // Calculate scores (lower is better)
  const scoredRoutes = routes.map((route) => {
    // Normalize each metric to 0-1 range
    const normalizedTime =
      maxTime > minTime ? (route.duration - minTime) / (maxTime - minTime) : 0;
    const normalizedDistance =
      maxDistance > minDistance
        ? (route.distance - minDistance) / (maxDistance - minDistance)
        : 0;
    const normalizedToll =
      maxToll > minToll
        ? ((route.totalTollCost || 0) - minToll) / (maxToll - minToll)
        : 0;

    // Calculate weighted score
    const score =
      w.time * normalizedTime +
      w.distance * normalizedDistance +
      w.toll * normalizedToll;

    return {
      ...route,
      score,
    };
  });

  // Sort by score (ascending - lower score is better)
  return scoredRoutes.sort((a, b) => a.score - b.score);
}

/**
 * Find the optimal route given budget constraints and preferences
 * @param {Array} routes - Array of route objects
 * @param {number} maxBudget - Maximum toll budget in cents
 * @param {string} routingMode - Routing mode
 * @returns {object|null} Optimal route or null
 */
export function findOptimalRoute(routes, maxBudget, routingMode) {
  if (!routes || routes.length === 0) {
    return null;
  }

  // Filter by budget
  const budgetFiltered = filterByBudget(routes, maxBudget);

  // Get routes within budget
  const affordableRoutes = budgetFiltered.filter((r) => r.withinBudget);

  // If no routes within budget, return the cheapest route
  if (affordableRoutes.length === 0) {
    const rankedAll = rankRoutes(budgetFiltered, ROUTING_MODES.CHEAPEST);
    return rankedAll[0] || null;
  }

  // Rank affordable routes
  const rankedRoutes = rankRoutes(affordableRoutes, routingMode);

  return rankedRoutes[0] || null;
}

/**
 * Optimize all routes with budget and preferences
 * @param {Array} routes - Array of route objects
 * @param {object} preferences - User preferences
 * @returns {object} Optimization result
 */
export function optimizeRoutes(routes, preferences = {}) {
  const {
    maxTollBudget = Infinity,
    routingMode = ROUTING_MODES.FASTEST,
  } = preferences;

  if (!routes || routes.length === 0) {
    return {
      allRoutes: [],
      affordableRoutes: [],
      optimalRoute: null,
      hasOverBudgetRoutes: false,
    };
  }

  // Filter and rank
  const filtered = filterByBudget(routes, maxTollBudget);
  const ranked = rankRoutes(filtered, routingMode);

  // Separate affordable and over-budget routes
  const affordableRoutes = ranked.filter((r) => r.withinBudget);
  const overBudgetRoutes = ranked.filter((r) => !r.withinBudget);

  // Find optimal route
  const optimalRoute = affordableRoutes.length > 0 ? affordableRoutes[0] : null;

  return {
    allRoutes: [...affordableRoutes, ...overBudgetRoutes],
    affordableRoutes,
    overBudgetRoutes,
    optimalRoute,
    hasOverBudgetRoutes: overBudgetRoutes.length > 0,
  };
}
