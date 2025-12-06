import { useState, useRef, useEffect } from 'react';
import { useGeocoding } from '../../hooks/useGeocoding';
import './LocationInput.css';

function LocationInput({
  label,
  placeholder,
  onLocationSelect,
  value,
  showCurrentLocation = true,
  icon = '📍'
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    selectedLocation,
    selectLocation,
    clearSelection,
    useCurrentLocation,
  } = useGeocoding();

  // Handle external value changes
  useEffect(() => {
    if (value && value !== query) {
      setQuery(value);
    }
  }, [value]);

  // Notify parent of selection
  useEffect(() => {
    if (selectedLocation) {
      onLocationSelect?.(selectedLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  // Handle input change
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowSuggestions(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    selectLocation(suggestion);
    setShowSuggestions(false);
  };

  // Handle current location click
  const handleCurrentLocationClick = async () => {
    await useCurrentLocation();
    setShowSuggestions(false);
  };

  // Handle clear button
  const handleClear = () => {
    clearSelection();
    onLocationSelect?.(null);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="location-input">
      <label className="location-input-label">
        <span className="label-icon">{icon}</span>
        {label}
      </label>

      <div className="location-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="location-input-field"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
        />

        {query && (
          <button
            className="location-input-clear"
            onClick={handleClear}
            aria-label="Clear"
          >
            ✕
          </button>
        )}

        {isLoading && (
          <div className="location-input-loading">
            <span className="loading-spinner">⟳</span>
          </div>
        )}
      </div>

      {error && (
        <div className="location-input-error">
          {error}
        </div>
      )}

      {showSuggestions && (suggestions.length > 0 || showCurrentLocation) && (
        <div ref={suggestionsRef} className="location-suggestions">
          {showCurrentLocation && (
            <button
              className="location-suggestion current-location"
              onClick={handleCurrentLocationClick}
            >
              <span className="suggestion-icon">📍</span>
              <span className="suggestion-text">
                <span className="suggestion-name">Use Current Location</span>
              </span>
            </button>
          )}

          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="location-suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-icon">📌</span>
              <span className="suggestion-text">
                <span className="suggestion-name">{suggestion.shortName}</span>
                <span className="suggestion-address">{suggestion.name}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationInput;
