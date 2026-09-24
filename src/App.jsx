import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import WatchList from "./components/wlist";
import SearchPage from "./components/search";
import Navbar from "./components/nav";
import Btn from "./components/btns";
import Movies from "./components/movies";
import Drama from "./components/drama";
import MoviCBot from "./components/chatbot";
import MovieDetails from "./components/movieDetails";
import DramaDetails from "./components/dramaDetails";
import { FavoritesProvider } from "./FavoritesProvider";

function Layout() {
  return (
    <div>
      <Navbar />
      <Btn />
      <Outlet />

      <Link to="/chatbot">
        <button className="chatbot" aria-label="Open chatbot">
          🤖
        </button>
      </Link>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Movies /> },
      { path: "movies", element: <Movies /> },
      { path: "drama", element: <Drama /> },
    ],
  },
  { path: "wList", element: <WatchList /> },
  { path: "search", element: <SearchPage /> },
  { path: "chatbot", element: <MoviCBot /> },
  { path: "movie/:id", element: <MovieDetails /> },
  { path: "tv/:id", element: <DramaDetails /> },
]);

export default function App() {
  return (
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>
  );
}
