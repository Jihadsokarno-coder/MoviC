import { useEffect, useState } from "react";
import FavoritesContext from "./FavoritesContext";

const STORAGE_KEY = "movic-favorites";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY);
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(item, type) {
    setFavorites((current) => {
      const exists = current.some(
        (favorite) => favorite.id === item.id && favorite.type === type
      );

      if (exists) {
        return current.filter(
          (favorite) =>
            !(favorite.id === item.id && favorite.type === type)
        );
      }

      return [...current, { ...item, type }];
    });
  }

  function removeFromFavorites(id, type) {
    setFavorites((current) =>
      current.filter(
        (favorite) =>
          !(favorite.id === id && favorite.type === type)
      )
    );
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, removeFromFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}