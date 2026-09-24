import "../App.css";
import { NavLink } from "react-router-dom";

function Btn() {
  return (
    <div className="buttons">
      <NavLink
        to="/movies"
        className={({ isActive }) => (isActive ? "movies active" : "movies")}
      >
        <p className="movies">
          <span className="icons">🎬</span>
          <b>Movies</b>
        </p>
      </NavLink>

      <span id="stand">|</span>

      <NavLink
        to="/drama"
        className={({ isActive }) => (isActive ? "drama active" : "drama")}
      >
        <p>
          <span className="icons">📽</span>
          <b>TV Shows</b>
        </p>
      </NavLink>

    </div>
  );
}

export default Btn;
