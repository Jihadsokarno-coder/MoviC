import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../useFavorites.js";
const API_KEY = "1837df6f96a1fbbc7c26a8d59ec50fd3";

function Drama() {
  const [drama, setDrama] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${page}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setDrama(data.results || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch((error) => console.error("Could not load TV shows:", error));
  }, [page]);

  return (
    <div className="containers">
      <h4>✨ Popular TV Shows</h4>

      <div className="grid">
        {drama.map((show) => {
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
                <p>{show.first_air_date}</p>
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

export default Drama;
