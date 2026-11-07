import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div>Kabob Express</div>
        <nav className="nav">
          <div>Home</div>
          <div>Menu</div>
          <div>About</div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
