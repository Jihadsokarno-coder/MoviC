import { Link } from "react-router-dom";
import { useFavorites } from "../useFavorites.js";
import "../App.css";

function Navbar() {
  const { favorites } = useFavorites();

  return (
    <nav className="nav-bar">
      <h1 className="logo">MoviC</h1>

      <div className="nav-actions">
        <Link to="/search" className="search">
          <span className="search-icon">⌕</span>
          <span id="text">search</span>
        </Link>

        <Link to="/wList" className="heart-link" aria-label="Open wishlist">
          <i className="fa-solid fa-heart">
            <span className="counter">{favorites.length}</span>
          </i>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
