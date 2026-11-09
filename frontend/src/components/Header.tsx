import { Link } from "react-router-dom";
import { FaShoppingBasket, FaUserCircle } from "react-icons/fa";
import { AvatarIcon } from "@radix-ui/react-icons";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <nav className="logo-container">
          <Link to={"/home"} className="kabob-logo">
            <img className="kabob-pic" src="/kabob-logo.png" />
          </Link>
        </nav>

        <nav className="nav">
          <Link to={"/home"}>Home</Link>
          <Link to={"/menu"}>Menu</Link>
          <Link to={"/home"}>About</Link>
          <Link to={"/home"}>Contact</Link>
        </nav>
        <nav className="icon-links">
          <Link to={"/cart"}>
            <FaShoppingBasket className="basket-icon" />
          </Link>
          <Link to={"/cart"} className="profile-icon">
            <AvatarIcon className="avatar-icon" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
