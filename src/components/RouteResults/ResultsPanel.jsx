import { useState } from 'react';
import { useRoute } from '../../contexts/RouteContext';
import RouteCard from './RouteCard';
import TollBreakdown from './TollBreakdown';
import NavigationPanel from '../Navigation/NavigationPanel';
import ActiveNavigation from '../Navigation/ActiveNavigation';
import './ResultsPanel.css';

function ResultsPanel() {
  const { routes, selectedRouteId, setSelectedRoute } = useRoute();
  const [isNavigating, setIsNavigating] = useState(false);

  if (!routes || routes.length === 0) {
    return null;
  }

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);

  const handleSelectRoute = (routeId) => {
    setSelectedRoute(routeId);
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  const handleExitNavigation = () => {
    setIsNavigating(false);
  };

  // Full-screen navigation mode
  if (isNavigating && selectedRoute) {
    return <ActiveNavigation route={selectedRoute} onExit={handleExitNavigation} />;
  }

  return (
    <div className="results-panel">
      <div className="results-header">
        <h3>Routes Found</h3>
        <div className="results-count">{routes.length} options</div>
      </div>

      <div className="routes-list">
        {routes.map((route, index) => (
          <RouteCard
            key={route.id}
            route={route}
            index={index}
            isSelected={route.id === selectedRouteId}
            onSelect={handleSelectRoute}
          />
        ))}
      </div>

      {selectedRoute && selectedRoute.tolls && selectedRoute.tolls.length > 0 && (
        <TollBreakdown route={selectedRoute} />
      )}

      {selectedRoute && (
        <NavigationPanel
          route={selectedRoute}
          onStartNavigation={handleStartNavigation}
        />
      )}
    </div>
  );
}

export default ResultsPanel;
