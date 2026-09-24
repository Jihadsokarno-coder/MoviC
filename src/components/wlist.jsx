import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../useFavorites.js";
import "../App.css";

function WishList() {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useFavorites();

  const movies = favorites.filter((favorite) => favorite.type === "movie");
  const shows = favorites.filter((favorite) => favorite.type === "tv");

  return (
    <div className="containers">
      <nav className="nav-bar">
        <h1 className="logo">MoviC</h1>

        <div className="nav-actions">
          <Link to="/search" className="search">
            <span className="search-icon">⌕</span>
            <span id="text">search</span>
          </Link>
        </div>
      </nav>

      <main className="wishlist-content">
        {favorites.length === 0 ? (
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="icon-wrapper">
                <img
                  src="/empty.png"
                  alt="Your wishlist is empty"
                  className="empty-icon"
                />
              </div>
              <h2 className="empty-title">
                No movies or shows in your watchlist
              </h2>
            </div>
          </div>
        ) : (
          <>
            <h4 className="wishlist-title">❤️ My Watchlist</h4>

            {movies.length > 0 && (
              <section>
                <h4>🎬 Movies</h4>
                <div className="grid">
                  {movies.map((movie) => (
                    <div
                      className="card"
                      key={`movie-${movie.id}`}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "/empty.png"
                        }
                        alt={movie.title}
                        className="poster"
                      />

                      <div className="card-info">
                        <h5>{movie.title}</h5>
                        <span className="rating">
                          ⭐ {(movie.vote_average || 0).toFixed(1)}
                        </span>

                        <button
                          type="button"
                          className="fav"
                          aria-label="Remove from wishlist"
                          style={{ color: "#941d8e" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeFromFavorites(movie.id, "movie");
                          }}
                        >
                          <i className="fa-solid fa-heart" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {shows.length > 0 && (
              <section>
                <h4>📺 TV Shows</h4>
                <div className="grid">
                  {shows.map((show) => (
                    <div
                      className="card"
                      key={`tv-${show.id}`}
                      onClick={() => navigate(`/tv/${show.id}`)}
                    >
                      <img
                        src={
                          show.poster_path
                            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                            : "/empty.png"
                        }
                        alt={show.name}
                        className="poster"
                      />

                      <div className="card-info">
                        <h5>{show.name}</h5>
                        <span className="rating">
                          ⭐ {(show.vote_average || 0).toFixed(1)}
                        </span>

                        <button
                          type="button"
                          className="fav"
                          aria-label="Remove from wishlist"
                          style={{ color: "#941d8e" }}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeFromFavorites(show.id, "tv");
                          }}
                        >
                          <i className="fa-solid fa-heart" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <button className="backBtn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <Link to="/chatbot">
        <button className="chatbot" aria-label="Open chatbot">
          🤖
        </button>
      </Link>
    </div>
  );
}

export default WishList;
