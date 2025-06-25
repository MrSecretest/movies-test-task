import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { getMovie, type Movie } from "../features/movies/moviesSlice";
import MovieExpandable from "./movie";

function MovieSearch() {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [actor, setActor] = useState("");
  const [sort, setSort] = useState<"id" | "title" | "year">("id");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie>();
  const [movieId, setMovieId] = useState<number>();
  const selectedMovie = useSelector(
    (state: RootState) => state.movies.selected
  );

  const handleGetMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (movieId > 0) {
      dispatch(getMovie(movieId));
    } else if (movieId == undefined) {
      return;
    }
  };

  useEffect(() => {
    if (selectedMovie) {
      //@ts-ignore
      setFoundMovie(selectedMovie.data);
    }
  }, [selectedMovie]);
  return (
    <div className="search-form">
      <form onSubmit={handleGetMovie} className="search-switcher">
        {advancedSearch ? (
          <div className="advanced-search">
            <div className="search-by-box">
              <input
                type="text"
                placeholder="by Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="by Actor"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
              />
            </div>
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
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
            </div>
            <input
              type="number"
              placeholder="Enter Movie ID"
              value={movieId}
              onChange={(e) => setMovieId(Number(e.target.value))}
            />
          </div>
        ) : (
          <input type="text" placeholder="Search By Title or Actor" />
        )}
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
        {foundMovie && (
          <MovieExpandable movieData={foundMovie}></MovieExpandable>
        )}
      </div>
    </div>
  );
}

export default MovieSearch;
