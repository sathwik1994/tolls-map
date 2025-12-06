import { useState, useEffect, useCallback } from 'react';
import { geocodeAddress, getCurrentLocation } from '../services/mapboxService';
import { useDebounce } from './useDebounce';

/**
 * Hook for geocoding with autocomplete suggestions
 * @param {object} options - Configuration options
 * @returns {object} Geocoding state and functions
 */
export function useGeocoding(options = {}) {
  const {
    debounceDelay = 300,
    minQueryLength = 3,
    autoSearch = true,
  } = options;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const debouncedQuery = useDebounce(query, debounceDelay);

  /**
   * Search for locations based on query
   */
  const searchLocations = useCallback(async (searchQuery, searchOptions = {}) => {
    if (!searchQuery || searchQuery.length < minQueryLength) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await geocodeAddress(searchQuery, searchOptions);
      setSuggestions(results);
    } catch (err) {
      setError(err.message);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [minQueryLength]);

  /**
   * Select a location from suggestions
   */
  const selectLocation = useCallback((location) => {
    setSelectedLocation(location);
    setQuery(location.name);
    setSuggestions([]);
  }, []);

  /**
   * Clear the current selection
   */
  const clearSelection = useCallback(() => {
    setSelectedLocation(null);
    setQuery('');
    setSuggestions([]);
    setError(null);
  }, []);

  /**
   * Get user's current location
   */
  const useCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const coordinates = await getCurrentLocation();
      const location = {
        id: 'current-location',
        name: 'Current Location',
        shortName: 'Current Location',
        coordinates,
      };
      setSelectedLocation(location);
      setQuery('Current Location');
      setSuggestions([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (autoSearch && debouncedQuery && debouncedQuery.length >= minQueryLength) {
      searchLocations(debouncedQuery);
    }
  }, [debouncedQuery, autoSearch, minQueryLength, searchLocations]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    selectedLocation,
    searchLocations,
    selectLocation,
    clearSelection,
    useCurrentLocation,
  };
}

export default useGeocoding;
