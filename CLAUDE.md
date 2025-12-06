# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Google Maps-like toll-aware routing application built with React + Vite. Features interactive mapping with Mapbox, route optimization based on toll budget constraints, and detailed toll rate information for US toll roads.

**Tech Stack:**
- React 19.2.0 with Vite 7.2.4
- Mapbox GL JS + react-map-gl for interactive mapping
- @turf/turf for geospatial calculations
- axios for API requests
- react-hook-form for form handling

## Commands

```bash
# Development
npm run dev       # Start dev server with HMR (http://localhost:5173)

# Build
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build

# Linting
npm run lint      # Run ESLint on codebase
```

## Environment Setup

Create a `.env` file in the project root with:
```bash
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
VITE_TOLLGURU_API_KEY=your_tollguru_key_here
```

Get your Mapbox token at: https://account.mapbox.com/access-tokens/
Get TollGuru API key at: https://tollguru.com/toll-api

## Architecture

### Application Flow
`index.html` → `src/main.jsx` → `src/App.jsx` → `MainLayout` + `MapContainer`

**App Structure:**
- `App.jsx` wraps everything with `MapProvider` for global map state
- `MainLayout` provides Header + Sidebar + Main content area layout
- `MapContainer` displays the interactive Mapbox map with controls

### State Management
Uses React Context API:
- **MapContext** (`src/contexts/MapContext.jsx`) - Map instance, view state, bounds
- **RouteContext** (`src/contexts/RouteContext.jsx`) - Origin, destination, routes, selected route
- **PreferencesContext** (`src/contexts/PreferencesContext.jsx`) - User preferences (toll budget, routing mode)

### Key Components

**Layout** (`src/components/Layout/`):
- `MainLayout.jsx` - Main app layout with header, sidebar, and content area
- `Header.jsx` - App header with title and branding
- `Sidebar.jsx` - Collapsible sidebar for search/results

**Map** (`src/components/Map/`):
- `MapContainer.jsx` - Mapbox GL map with navigation, geolocate, scale controls, route display
- `RouteLayer.jsx` - Renders route lines on map (color-coded, interactive)

**Route Search** (`src/components/RouteSearch/`):
- `SearchPanel.jsx` - Origin/destination inputs, toll budget, search button
- `LocationInput.jsx` - Autocomplete location input with Mapbox Geocoding

**Route Results** (`src/components/RouteResults/`):
- `ResultsPanel.jsx` - Displays all route options
- `RouteCard.jsx` - Individual route card with stats (time, distance, tolls)
- `TollBreakdown.jsx` - Itemized toll costs for selected route

### Hooks
- `useMapbox` (`src/hooks/useMapbox.js`) - Map utilities (flyTo, fitBounds, etc.)
- `useGeocoding` (`src/hooks/useGeocoding.js`) - Location search with autocomplete
- `useDebounce` (`src/hooks/useDebounce.js`) - Debounce user inputs

### Services
- `mapboxService.js` - Geocoding, reverse geocoding, directions API, current location
- `tollService.js` - Toll data fetching (TollGuru API + offline estimation)
- `routeOptimizer.js` - Budget filtering, route ranking by mode (fastest/shortest/cheapest)

### Data & Utilities
- `src/data/tollRoads.json` - Static toll plaza database (10+ major US toll roads)
- `src/utils/constants.js` - Configuration constants, API endpoints, map settings, route colors
- `src/utils/formatters.js` - Format distance, duration, currency for display

## Features

✅ **Complete Feature Set:**
1. **Interactive Map** - Mapbox GL with zoom, pan, rotate, geolocate controls
2. **Location Search** - Autocomplete search powered by Mapbox Geocoding
3. **Current Location** - Use GPS to set origin/destination
4. **Multiple Routes** - Get up to 3 alternative driving routes
5. **Toll Information** - Automatic toll detection and cost calculation
6. **Budget Filtering** - Set max toll budget, filter routes accordingly
7. **Route Optimization** - Rank routes by fastest/shortest/cheapest
8. **Visual Route Display** - Color-coded routes on map with auto-fit bounds
9. **Detailed Breakdown** - View itemized toll costs for each route
10. **Route Selection** - Click any route to select and view details

## How It Works

1. **Enter Locations**: Type origin and destination (autocomplete suggestions appear)
2. **Set Budget**: Enter max toll budget in dollars (optional)
3. **Search**: Click "Search Routes" to calculate options
4. **View Results**: See multiple routes with time, distance, and toll costs
5. **Select Route**: Click any route card to highlight on map
6. **View Details**: Expand toll breakdown to see itemized costs

## Data Sources

- **Routing**: Mapbox Directions API (100k free requests/month)
- **Geocoding**: Mapbox Geocoding API
- **Tolls**: TollGuru API (500 free requests/month) with offline fallback
- **Fallback Data**: Static database of 10 major US toll roads/plazas

## Implementation Status

✅ **ALL PHASES COMPLETE**
- ✅ Phase 1: Foundation (dependencies, folder structure, layout)
- ✅ Phase 2: Map Integration (Mapbox, controls, context)
- ✅ Phase 3: Location Search (geocoding, autocomplete)
- ✅ Phase 4: Route Display (route layers, auto-fit bounds)
- ✅ Phase 5: Toll Data (TollGuru integration, static database)
- ✅ Phase 6: Budget Optimization (filtering, ranking)
- ✅ Phase 7: Results Display (route cards, toll breakdown)

## ESLint Configuration
- Flat config format in `eslint.config.js`
- Ignores `dist/` directory
- Custom rule: `no-unused-vars` allows variables matching `^[A-Z_]` pattern
- Target: ECMAScript 2020, browser globals
