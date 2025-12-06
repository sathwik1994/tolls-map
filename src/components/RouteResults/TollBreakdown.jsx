import { formatCurrency } from '../../utils/formatters';
import './TollBreakdown.css';

function TollBreakdown({ route }) {
  if (!route || !route.tolls || route.tolls.length === 0) {
    return null;
  }

  return (
    <div className="toll-breakdown">
      <div className="toll-breakdown-header">
        <h4>Toll Breakdown</h4>
        <div className="total-toll">
          Total: {formatCurrency(route.totalTollCost)}
        </div>
      </div>

      <div className="toll-list">
        {route.tolls.map((toll) => (
          <div key={toll.id} className="toll-item">
            <div className="toll-info">
              <div className="toll-name">{toll.name}</div>
              {toll.authority && toll.authority !== 'Estimated' && (
                <div className="toll-authority">{toll.authority}</div>
              )}
              {toll.authority === 'Estimated' && (
                <div className="toll-estimated">⚠️ Estimated cost</div>
              )}
            </div>
            <div className="toll-cost">{formatCurrency(toll.cost)}</div>
          </div>
        ))}
      </div>

      <div className="toll-note">
        💡 Toll costs are estimates and may vary based on time of day, vehicle type, and payment method.
      </div>
    </div>
  );
}

export default TollBreakdown;
