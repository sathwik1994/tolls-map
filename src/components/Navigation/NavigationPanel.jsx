import { useState } from 'react';
import { formatDistance, formatDuration } from '../../utils/formatters';
import './NavigationPanel.css';

function NavigationPanel({ route, onStartNavigation }) {
  const [expandedStep, setExpandedStep] = useState(null);

  if (!route || !route.steps || route.steps.length === 0) {
    return null;
  }

  const getManeuverIcon = (type) => {
    const maneuverIcons = {
      'turn-right': '↗️',
      'turn-left': '↖️',
      'turn-slight-right': '➡️',
      'turn-slight-left': '⬅️',
      'turn-sharp-right': '⤴️',
      'turn-sharp-left': '⤵️',
      'straight': '⬆️',
      'uturn': '↩️',
      'arrive': '🏁',
      'depart': '🚗',
      'merge': '🔀',
      'fork': '🔱',
      'roundabout': '🔄',
      'exit-roundabout': '↪️',
      'ramp': '🛣️',
      'default': '➡️',
    };

    return maneuverIcons[type] || maneuverIcons.default;
  };

  const toggleStep = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="navigation-panel">
      <div className="navigation-header">
        <h3>Turn-by-Turn Directions</h3>
        <button
          className="start-navigation-btn"
          onClick={onStartNavigation}
        >
          <span>🧭</span>
          Start Navigation
        </button>
      </div>

      <div className="route-summary-bar">
        <div className="summary-item">
          <span className="summary-icon">⏱️</span>
          <span className="summary-value">{formatDuration(route.duration)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-icon">📏</span>
          <span className="summary-value">{formatDistance(route.distance)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-icon">🚦</span>
          <span className="summary-value">{route.steps.length} steps</span>
        </div>
      </div>

      <div className="steps-list">
        {route.steps.map((step, index) => {
          const isExpanded = expandedStep === index;
          const maneuver = step.maneuver?.type || 'straight';

          return (
            <div
              key={index}
              className={`step-item ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleStep(index)}
            >
              <div className="step-main">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon">
                  {getManeuverIcon(maneuver)}
                </div>
                <div className="step-info">
                  <div className="step-instruction">
                    {step.maneuver?.instruction || step.instruction || 'Continue'}
                  </div>
                  <div className="step-details">
                    {formatDistance(step.distance)} • {formatDuration(step.duration)}
                  </div>
                </div>
              </div>

              {isExpanded && step.name && (
                <div className="step-expanded">
                  <div className="step-road-name">
                    <strong>Road:</strong> {step.name}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NavigationPanel;
