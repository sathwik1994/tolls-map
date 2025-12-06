import { MapProvider } from './contexts/MapContext';
import { RouteProvider } from './contexts/RouteContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import MainLayout from './components/Layout/MainLayout';
import MapContainer from './components/Map/MapContainer';
import SearchPanel from './components/RouteSearch/SearchPanel';
import './App.css'

function App() {
  return (
    <PreferencesProvider>
      <MapProvider>
        <RouteProvider>
          <MainLayout sidebar={<SearchPanel />}>
            <MapContainer />
          </MainLayout>
        </RouteProvider>
      </MapProvider>
    </PreferencesProvider>
  )
}

export default App
