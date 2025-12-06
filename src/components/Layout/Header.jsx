import './Header.css';

function Header() {
  const handleHomeClick = () => {
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title" onClick={handleHomeClick}>
          TollsMap
        </h1>
        <p className="header-subtitle">Smart Route Planning with Toll Optimization</p>
      </div>
    </header>
  );
}

export default Header;
