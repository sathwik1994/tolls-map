import { useState, useEffect } from 'react';
import { useMap } from '../../contexts/MapContext';
import './Sidebar.css';

function Sidebar({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { mapInstance } = useMap();

  // Resize map when sidebar collapses/expands
  useEffect(() => {
    if (mapInstance) {
      // Delay to allow CSS transition to complete
      const timeoutId = setTimeout(() => {
        mapInstance.resize();
      }, 350); // Slightly longer than the 300ms CSS transition

      return () => clearTimeout(timeoutId);
    }
  }, [isCollapsed, mapInstance]);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '→' : '←'}
      </button>
      <div className="sidebar-content">
        {!isCollapsed && children}
      </div>
    </aside>
  );
}

export default Sidebar;
