import { useState, useEffect } from 'react';
import { useRoute } from '../../contexts/RouteContext';
import { useMap } from '../../contexts/MapContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { getDirections } from '../../services/mapboxService';
import { enrichRoutesWithTolls } from '../../services/tollService';
import { optimizeRoutes } from '../../services/routeOptimizer';
import LocationInput from './LocationInput';
import ResultsPanel from '../RouteResults/ResultsPanel';
import './SearchPanel.css';

function SearchPanel() {
  const {
    origin,
    destination,
    routes,
    setOrigin,
    setDestination,
    setRoutes,
    setSelectedRoute,
    setLoading,
    setError,
    swapLocations,
    isLoading,
    error,
  } = useRoute();

  const { flyTo } = useMap();
  const { maxTollBudget, setMaxTollBudget, routingMode, avoidTolls, setAvoidTolls, avoidHighways, setAvoidHighways } = usePreferences();

  const [canSearch, setCanSearch] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  // Check if both origin and destination are set
  useEffect(() => {
    setCanSearch(origin !== null && destination !== null);
  }, [origin, destination]);

  // Handle origin selection
  const handleOriginSelect = (location) => {
    setOrigin(location);
    if (location?.coordinates) {
      flyTo(location.coordinates, 12);
    }
  };

  // Handle destination selection
  const handleDestinationSelect = (location) => {
    setDestination(location);
    if (location?.coordinates) {
      flyTo(location.coordinates, 12);
    }
  };

  // Handle search button click
  const handleSearch = async () => {
    if (!origin || !destination) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Get routes from Mapbox
      const coordinates = [origin.coordinates, destination.coordinates];
      const excludeOptions = [];
      if (avoidTolls) excludeOptions.push('toll');
      if (avoidHighways) excludeOptions.push('motorway');

      const routes = await getDirections(coordinates, {
        alternatives: true,
        steps: true,
        exclude: excludeOptions,
      });

      if (routes.length === 0) {
        setError('No routes found between these locations');
        return;
      }

      // Step 2: Enrich routes with toll data
      const routesWithTolls = await enrichRoutesWithTolls(routes);

      // Step 3: Optimize routes based on budget and preferences
      const budget = budgetInput ? parseFloat(budgetInput) * 100 : Infinity; // Convert to cents
      const optimized = optimizeRoutes(routesWithTolls, {
        maxTollBudget: budget,
        routingMode,
      });

      setRoutes(optimized.allRoutes);

      // Auto-select the first route
      if (optimized.allRoutes.length > 0) {
        setSelectedRoute(optimized.allRoutes[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to calculate routes');
    } finally {
      setLoading(false);
    }
  };

  // Handle swap button click
  const handleSwap = () => {
    swapLocations();
  };

  return (
    <div className="search-panel">
      <div className="search-panel-header">
        <h2>Route Search</h2>
        <p>Find the best route within your toll budget</p>
      </div>

      <div className="search-panel-content">
        <LocationInput
          label="Origin"
          placeholder="Enter starting point"
          onLocationSelect={handleOriginSelect}
          icon="🟢"
        />

        <button
          className="swap-locations-btn"
          onClick={handleSwap}
          disabled={!origin && !destination}
          aria-label="Swap origin and destination"
        >
          ⇅
        </button>

        <LocationInput
          label="Destination"
          placeholder="Enter destination"
          onLocationSelect={handleDestinationSelect}
          icon="🔴"
        />

        <div className="search-panel-divider" />

        <div className="route-options-section">
          <div className="avoid-tolls-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={avoidTolls}
                onChange={(e) => setAvoidTolls(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">
                <span>🚫</span>
                Avoid Tolls
              </span>
            </label>
          </div>

          <div className="avoid-highways-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={avoidHighways}
                onChange={(e) => setAvoidHighways(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">
                <span>🛣️</span>
                Avoid Highways
              </span>
            </label>
          </div>

          {!avoidTolls && (
            <div className="toll-budget-section">
              <label className="toll-budget-label">
                <span>💰</span>
                Max Toll Budget
              </label>
              <div className="toll-budget-input-wrapper">
                <span className="toll-budget-currency">$</span>
                <input
                  type="number"
                  className="toll-budget-input"
                  placeholder="20"
                  min="0"
                  step="5"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                />
              </div>
              <p className="toll-budget-hint">
                Leave empty for unlimited budget
              </p>
            </div>
          )}
        </div>

        <button
          className="search-routes-btn"
          onClick={handleSearch}
          disabled={!canSearch || isLoading}
        >
          {isLoading ? (
            <>
              <span className="btn-spinner">⟳</span>
              Searching...
            </>
          ) : (
            <>
              <span>🔍</span>
              Search Routes
            </>
          )}
        </button>

        {error && (
          <div className="search-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {!routes || routes.length === 0 ? (
          <div className="search-panel-footer">
            <p className="info-text">
              ℹ️ Routes will include toll information and alternative options
            </p>
          </div>
        ) : null}
      </div>

      {routes && routes.length > 0 && <ResultsPanel />}
    </div>
  );
}

export default SearchPanel;
