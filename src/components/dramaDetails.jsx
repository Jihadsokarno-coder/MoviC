import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useFavorites } from "../useFavorites.js";
import "../App.css";

const API_KEY = "1837df6f96a1fbbc7c26a8d59ec50fd3";

function DramaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const [drama, setDrama] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => setDrama(data))
      .catch((error) =>
        console.error("Could not load TV show details:", error),
      );

    fetch(
      `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${API_KEY}`,
    )
      .then((response) => response.json())
      .then((data) => setRecommendations(data.results || []))
      .catch((error) =>
        console.error("Could not load recommendations:", error),
      );

    window.scrollTo(0, 0);
  }, [id]);

  if (!drama) {
    return (
      <div className="details-container">
        <p>Loading TV show details...</p>
      </div>
    );
  }

  const isFavorite = favorites.some(
    (favorite) => favorite.id === drama.id && favorite.type === "tv",
  );
  const ratingStars = Math.round((drama.vote_average || 0) / 2);

  return (
    <div className="details-container">
      <div className="main-details">
        <div className="poster-box">
          <img
            src={
              drama.poster_path
                ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
                : "/empty.png"
            }
            alt={drama.name}
          />
        </div>

        <div className="info-box">
          <div className="header-info">
            <h2>{drama.name}</h2>
            <button
              type="button"
              className="fav-btn"
              aria-label={
                isFavorite ? "Remove from wishlist" : "Add to wishlist"
              }
              style={{ color: isFavorite ? "#941d8e" : "#817f81" }}
              onClick={() => toggleFavorite(drama, "tv")}
            >
              <i className="fa-solid fa-heart" />
            </button>
          </div>

          <p className="release-date">{drama.first_air_date}</p>

          <div className="rating-box" style={{ margin: "10px 0" }}>
            <span style={{ color: "#fff", fontSize: "1.2rem" }}>
              {"★".repeat(ratingStars)}
              {"☆".repeat(5 - ratingStars)}
            </span>
            <span
              style={{ marginLeft: "12px", color: "#ccc", fontWeight: "bold" }}
            >
              {drama.vote_count}
            </span>
          </div>

          <p className="overview">{drama.overview}</p>

          <div className="genres">
            {drama.genres?.map((genre) => (
              <span key={genre.id} className="genre-badge">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="meta-info">
            <p>
              <strong>Episode Duration:</strong>{" "}
              {drama.episode_run_time?.[0] ?? "Unknown"} Min.
            </p>
            <p>
              <strong>Languages:</strong>{" "}
              {drama.spoken_languages
                ?.map((language) => language.english_name)
                .join(", ")}
            </p>
          </div>

          {drama.homepage && (
            <a
              href={drama.homepage}
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
              onClick={() => navigate(`/tv/${recommendation.id}`)}
            >
              <img
                src={
                  recommendation.poster_path
                    ? `https://image.tmdb.org/t/p/w500${recommendation.poster_path}`
                    : "/empty.png"
                }
                alt={recommendation.name}
              />
              <p>{recommendation.name}</p>
            </div>
          ))}
        </div>

        <Link to="/chatbot">
          <button className="chatbot" aria-label="Open chatbot">
            🤖
          </button>
        </Link>

        <button className="backBtn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default DramaDetails;
