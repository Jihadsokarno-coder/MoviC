import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../useFavorites.js";
import "../App.css";

const API_KEY = "1837df6f96a1fbbc7c26a8d59ec50fd3";

function SearchPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [moviePage, setMoviePage] = useState(1);
  const [showPage, setShowPage] = useState(1);
  const [movieTotalPages, setMovieTotalPages] = useState(1);
  const [showTotalPages, setShowTotalPages] = useState(1);

  useEffect(() => {
    const movieUrl = query.trim()
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${moviePage}`
      : `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${moviePage}`;

    const showUrl = query.trim()
      ? `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${showPage}`
      : `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${showPage}`;

    fetch(movieUrl)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results || []);
        setMovieTotalPages(data.total_pages || 1);
      })
      .catch((error) => console.error("Could not search movies:", error));

    fetch(showUrl)
      .then((response) => response.json())
      .then((data) => {
        setShows(data.results || []);
        setShowTotalPages(data.total_pages || 1);
      })
      .catch((error) => console.error("Could not search TV shows:", error));
  }, [query, moviePage, showPage]);

  function renderPagination(page, totalPages, setPage) {
    return (
      <div className="slides">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          &lt;
        </button>

        {[...Array(5)].map((_, index) => {
          const pageNumber = page + index;
          if (pageNumber > totalPages) return null;

          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={page === pageNumber ? "active-page" : ""}
            >
              {pageNumber}
            </button>
          );
        })}

        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          &gt;
        </button>
      </div>
    );
  }

  return (
    <div className="containers">
      <nav className="nav-bar">
        <h1 className="logo">MoviC</h1>

        <div className="nav-actions">
          <Link to="/wList" className="heart-link" aria-label="Open wishlist">
            <i className="fa-solid fa-heart">
              <span className="counter">{favorites.length}</span>
            </i>
          </Link>
        </div>
      </nav>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for movies or TV shows..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setMoviePage(1);
            setShowPage(1);
          }}
        />
      </div>

      <h4>🎬 Movies</h4>
      <div className="grid">
        {movies.map((movie) => {
          const isFavorite = favorites.some(
            (favorite) => favorite.id === movie.id && favorite.type === "movie",
          );

          return (
            <div
              className="card"
              key={movie.id}
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
                  aria-label={
                    isFavorite ? "Remove from wishlist" : "Add to wishlist"
                  }
                  style={{ color: isFavorite ? "#941d8e" : "#191b1f" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(movie, "movie");
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {renderPagination(moviePage, movieTotalPages, setMoviePage)}

      <h4>📺 TV Shows</h4>
      <div className="grid">
        {shows.map((show) => {
          const isFavorite = favorites.some(
            (favorite) => favorite.id === show.id && favorite.type === "tv",
          );

          return (
            <div
              className="card"
              key={show.id}
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
                  aria-label={
                    isFavorite ? "Remove from wishlist" : "Add to wishlist"
                  }
                  style={{ color: isFavorite ? "#941d8e" : "#191b1f" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(show, "tv");
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {renderPagination(showPage, showTotalPages, setShowPage)}

      <button className="backBtn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}

export default SearchPage;
