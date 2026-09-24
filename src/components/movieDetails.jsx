import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useFavorites } from "../useFavorites.js";
import "../App.css";

const API_KEY = "1837df6f96a1fbbc7c26a8d59ec50fd3";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Could not load movie details:", error));

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`,
    )
      .then((response) => response.json())
      .then((data) => setRecommendations(data.results || []))
      .catch((error) =>
        console.error("Could not load recommendations:", error),
      );

    window.scrollTo(0, 0);
  }, [id]);

  if (!movie) {
    return (
      <div className="details-container">
        <p>Loading movie details...</p>
      </div>
    );
  }

  const isFavorite = favorites.some(
    (favorite) => favorite.id === movie.id && favorite.type === "movie",
  );
  const ratingStars = Math.round((movie.vote_average || 0) / 2);

  return (
    <div className="details-container">
      <div className="main-details">
        <div className="poster-box">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/empty.png"
            }
            alt={movie.title}
          />
        </div>

        <div className="info-box">
          <div className="header-info">
            <h2>{movie.title}</h2>
            <button
              type="button"
              className="fav-btn"
              aria-label={
                isFavorite ? "Remove from wishlist" : "Add to wishlist"
              }
              style={{ color: isFavorite ? "#941d8e" : "#817f81" }}
              onClick={() => toggleFavorite(movie, "movie")}
            >
              <i className="fa-solid fa-heart" />
            </button>
          </div>

          <p className="release-date">{movie.release_date}</p>

          <div className="rating-box" style={{ margin: "10px 0" }}>
            <span style={{ color: "#fff", fontSize: "1.2rem" }}>
              {"★".repeat(ratingStars)}
              {"☆".repeat(5 - ratingStars)}
            </span>
            <span
              style={{ marginLeft: "12px", color: "#ccc", fontWeight: "bold" }}
            >
              {movie.vote_count}
            </span>
          </div>

          <p className="overview">{movie.overview}</p>

          <div className="genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="genre-badge">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="meta-info">
            <p>
              <strong>Duration:</strong> {movie.runtime} Min.
            </p>
            <p>
              <strong>Languages:</strong>{" "}
              {movie.spoken_languages
                ?.map((language) => language.english_name)
                .join(", ")}
            </p>
          </div>

          {movie.homepage && (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noreferrer"
              className="website-btn"
            >
              Website <i className="fa-solid fa-link" />
            </a>
          )}
        </div>
      </div>

      <hr className="divider" />

      <div className="recommendations-section">
        <h3>✨ Recommendations</h3>

        <div className="rec-grid">
          {recommendations.slice(0, 6).map((recommendation) => (
            <div
              key={recommendation.id}
              className="rec-card"
              onClick={() => navigate(`/movie/${recommendation.id}`)}
            >
              <img
                src={
                  recommendation.poster_path
                    ? `https://image.tmdb.org/t/p/w500${recommendation.poster_path}`
                    : "/empty.png"
                }
                alt={recommendation.title}
              />
              <p>{recommendation.title}</p>
            </div>
          ))}
        </div>

        <button className="backBtn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <Link to="/chatbot">
          <button className="chatbot" aria-label="Open chatbot">
            🤖
          </button>
        </Link>
      </div>
    </div>
  );
}

export default MovieDetails;
