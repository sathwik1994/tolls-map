import { useState, useEffect, useCallback } from 'react';
import { formatDistance, formatDuration } from '../../utils/formatters';
import './ActiveNavigation.css';

function ActiveNavigation({ route, onExit }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  const currentStep = route.steps[currentStepIndex];
  const nextStep = route.steps[currentStepIndex + 1];
  const isLastStep = currentStepIndex === route.steps.length - 1;

  // Calculate remaining distance and time
  const remainingSteps = route.steps.slice(currentStepIndex);
  const remainingDistance = remainingSteps.reduce((sum, step) => sum + step.distance, 0);
  const remainingTime = remainingSteps.reduce((sum, step) => sum + step.duration, 0);

  // Simulate navigation progress (in real app, use GPS)
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        const newProgress = prev + 0.1; // Simulated progress
        if (newProgress >= 100 && !isLastStep) {
          setCurrentStepIndex((i) => i + 1);
          return 0;
        }
        return Math.min(newProgress, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStepIndex, isLastStep]);

  const handleNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex((i) => i + 1);
      setSimulatedProgress(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1);
      setSimulatedProgress(0);
    }
  };

  const getManeuverIcon = (type) => {
    const icons = {
      'turn-right': '↗️',
      'turn-left': '↖️',
      'turn-slight-right': '➡️',
      'turn-slight-left': '⬅️',
      'straight': '⬆️',
      'uturn': '↩️',
      'arrive': '🏁',
      'depart': '🚗',
      'merge': '🔀',
      'roundabout': '🔄',
      'default': '➡️',
    };
    return icons[type] || icons.default;
  };

  return (
    <div className="active-navigation">
      <div className="nav-header">
        <button className="nav-exit-btn" onClick={onExit}>
          ← Exit Navigation
        </button>
        <div className="nav-eta">
          ETA: {formatDuration(remainingTime)}
        </div>
      </div>

      <div className="nav-main">
        <div className="current-maneuver">
          <div className="maneuver-icon-large">
            {getManeuverIcon(currentStep.maneuver?.type)}
          </div>
          <div className="maneuver-instruction">
            {currentStep.maneuver?.instruction || currentStep.instruction || 'Continue'}
          </div>
          {currentStep.name && (
            <div className="maneuver-road">on {currentStep.name}</div>
          )}
        </div>

        <div className="nav-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${simulatedProgress}%` }}
            />
          </div>
          <div className="progress-info">
            <div className="distance-remaining">
              {formatDistance(currentStep.distance * (1 - simulatedProgress / 100))}
            </div>
          </div>
        </div>

        {nextStep && !isLastStep && (
          <div className="next-maneuver">
            <div className="next-label">Then</div>
            <div className="next-content">
              <span className="next-icon">
                {getManeuverIcon(nextStep.maneuver?.type)}
              </span>
              <span className="next-instruction">
                {nextStep.maneuver?.instruction || nextStep.instruction}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="nav-footer">
        <div className="nav-stats">
          <div className="stat">
            <div className="stat-label">Remaining</div>
            <div className="stat-value">{formatDistance(remainingDistance)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Step</div>
            <div className="stat-value">{currentStepIndex + 1} / {route.steps.length}</div>
          </div>
        </div>

        <div className="nav-controls">
          <button
            className="nav-control-btn"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
          >
            ← Prev
          </button>
          <button
            className="nav-control-btn primary"
            onClick={handleNextStep}
            disabled={isLastStep}
          >
            {isLastStep ? 'Arrived!' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActiveNavigation;
