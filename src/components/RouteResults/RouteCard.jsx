import { formatDistance, formatDuration, formatCurrency } from '../../utils/formatters';
import './RouteCard.css';

function RouteCard({ route, isSelected, onSelect, index }) {
  const handleClick = () => {
    onSelect(route.id);
  };

  return (
    <div
      className={`route-card ${isSelected ? 'selected' : ''} ${
        route.withinBudget === false ? 'over-budget' : ''
      }`}
      onClick={handleClick}
    >
      <div className="route-card-header">
        <div className="route-number">Route {index + 1}</div>
        {route.withinBudget === false && (
          <div className="over-budget-badge">Over Budget</div>
        )}
        {isSelected && <div className="selected-badge">✓ Selected</div>}
      </div>

      <div className="route-card-stats">
        <div className="stat">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{formatDuration(route.duration)}</span>
        </div>
        <div className="stat">
          <span className="stat-icon">📏</span>
          <span className="stat-value">{formatDistance(route.distance)}</span>
        </div>
        <div className="stat">
          <span className="stat-icon">💰</span>
          <span className="stat-value">
            {route.totalTollCost > 0
              ? formatCurrency(route.totalTollCost)
              : 'No tolls'}
          </span>
        </div>
      </div>

      {route.tolls && route.tolls.length > 0 && (
        <div className="route-card-tolls">
          <div className="toll-count">
            {route.tolls.length} toll{route.tolls.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {route.summary && (
        <div className="route-card-summary">{route.summary}</div>
      )}
    </div>
  );
}

export default RouteCard;
