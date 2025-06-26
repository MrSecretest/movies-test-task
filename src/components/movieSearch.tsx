import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import {
  getMovie,
  getMoviesList,
  type Movie,
} from "../features/movies/moviesSlice";
import MovieExpandable from "./movie";

function MovieSearch() {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [actor, setActor] = useState("");
  const [sort, setSort] = useState<"id" | "title" | "year">("id");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie>();
  const [movieId, setMovieId] = useState<number>(0);
  const [combinedSearch, setCombinedSearch] = useState("");

  const selectedMovie = useSelector(
    (state: RootState) => state.movies.selected
  );

  const moviesList = useSelector((state: RootState) => state.movies.list);

  const handleGetMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (movieId > 0) {
      dispatch(getMovie(movieId));
    } else {
      const searchParams = {
        actor,
        title,
        combinedSearch,
        sort,
        order,
        limit: "1000",
      };
      if (combinedSearch.length != 1) dispatch(getMoviesList(searchParams));
    }
  };

  useEffect(() => {
    if (selectedMovie) {
      setFoundMovie(selectedMovie);
    }
  }, [selectedMovie]);

  useEffect(() => {
    console.log(moviesList);
  }, [moviesList]);

  return (
    <div className="search-form">
      <form onSubmit={handleGetMovie} className="search-switcher">
        {advancedSearch ? (
          <div className="advanced-search">
            <p>Search by</p>
            <div className="search-by-box">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Actor"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
              />
            </div>
            <p>Sort by</p>
            <div className="select-container">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
              >
                <option value="id">ID</option>
                <option value="title">Title</option>
                <option value="year">Year</option>
              </select>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as any)}
              >
                <option value="ASC">ASC</option>
                <option value="DESC">DESC</option>
              </select>
            </div>
            <p>Search by</p>
            <input
              type="number"
              placeholder="Movie ID"
              value={movieId}
              onChange={(e) => setMovieId(Number(e.target.value))}
            />
          </div>
        ) : (
          <div>
            <p>Search by</p>
            <input
              value={combinedSearch}
              type="text"
              placeholder="Title or Actor"
              onChange={(e) => setCombinedSearch(e.target.value as any)}
            />
          </div>
        )}
        <button onSubmit={handleGetMovie}>Search</button>
        <label className="advanced-search-container">
          <input
            type="checkbox"
            checked={advancedSearch}
            onChange={() => setAdvancedSearch((prev) => !prev)}
          />{" "}
          Advanced Search
        </label>
      </form>
      <div className="foundMovies">
        <p>Movies: {moviesList.length}</p>
        {movieId && foundMovie && selectedMovie ? (
          <MovieExpandable movieData={foundMovie} />
        ) : (
          Array.isArray(moviesList) &&
          moviesList.map((movie) => {
            if (!movie || !movie.id || !movie.title) {
              return null;
            }

            return <MovieExpandable key={movie.id} movieData={movie} />;
          })
        )}
      </div>
    </div>
  );
}

export default MovieSearch;
