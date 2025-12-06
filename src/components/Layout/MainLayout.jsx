import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

function MainLayout({ sidebar, children }) {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-layout-body">
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
