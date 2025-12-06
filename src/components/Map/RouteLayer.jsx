import { Layer, Source } from 'react-map-gl';
import { useRoute } from '../../contexts/RouteContext';
import { useMap } from '../../contexts/MapContext';
import { ROUTE_COLORS } from '../../utils/constants';

function RouteLayer() {
  const { routes, selectedRouteId } = useRoute();
  const { setSelectedRoute } = useMap();

  if (!routes || routes.length === 0) {
    return null;
  }

  return (
    <>
      {routes.map((route, index) => {
        const isSelected = route.id === selectedRouteId;
        const routeColor = isSelected
          ? ROUTE_COLORS.SELECTED
          : index === 0
          ? ROUTE_COLORS.PRIMARY
          : index === 1
          ? ROUTE_COLORS.ALTERNATIVE_1
          : index === 2
          ? ROUTE_COLORS.ALTERNATIVE_2
          : ROUTE_COLORS.ALTERNATIVE_3;

        return (
          <Source
            key={route.id}
            id={`route-${route.id}`}
            type="geojson"
            data={{
              type: 'Feature',
              properties: {},
              geometry: route.geometry,
            }}
          >
            {/* Route outline for better visibility */}
            <Layer
              id={`route-outline-${route.id}`}
              type="line"
              paint={{
                'line-color': '#fff',
                'line-width': isSelected ? 10 : 8,
                'line-opacity': 0.8,
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />

            {/* Main route line */}
            <Layer
              id={`route-line-${route.id}`}
              type="line"
              paint={{
                'line-color': routeColor,
                'line-width': isSelected ? 8 : 6,
                'line-opacity': isSelected ? 1 : 0.8,
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />

            {/* Route casing for depth */}
            <Layer
              id={`route-casing-${route.id}`}
              type="line"
              paint={{
                'line-color': routeColor,
                'line-width': isSelected ? 4 : 3,
                'line-opacity': 1,
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />
          </Source>
        );
      })}
    </>
  );
}

export default RouteLayer;
