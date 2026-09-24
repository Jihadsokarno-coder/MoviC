import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../useFavorites.js";

const API_KEY = "1837df6f96a1fbbc7c26a8d59ec50fd3";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${page}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch((error) => console.error("Could not load movies:", error));
  }, [page]);

  return (
    <div className="containers">
      <h4>✨ Now Playing</h4>

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
                <p>{movie.release_date}</p>
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
    </div>
  );
}

export default Movies;
