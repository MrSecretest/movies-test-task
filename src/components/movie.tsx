import React, { useEffect, useState } from "react";
import {
  deleteMovie,
  getMovie,
  type Actor,
  type Movie,
} from "../features/movies/moviesSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";

type MovieExpandableProps = {
  movieData: Movie;
};

function MovieExpandable({ movieData }: MovieExpandableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [expanded, setExpanded] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const movieDetails = useSelector(
    (state: RootState) => state.movies.byId[movieData.id]
  );
  if (!movieData || !movieData.title || !movieData.year || !movieData.format) {
    return null;
  }

  const handleDelete = () => {
    dispatch(deleteMovie(movieData.id));
    setDeleted(!deleted);
  };

  const handleMoreInfo = () => {
    if (movieData.id > 0) {
      dispatch(getMovie(movieData.id));
    }
    setExpanded((prev) => !prev);
  };

  return (
    <>
      {!deleted && (
        <>
          <div className="movie-expandable">
            <p>{movieData?.title}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <p className="secondary-text">• {movieData?.year}</p>
              <button onClick={handleMoreInfo}>More</button>
              <button className="caution" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
          {expanded &&
            movieDetails?.actors?.map((actor: Actor) => (
              <p key={actor.id}>{actor.name}</p>
            ))}
        </>
      )}
    </>
  );
}

export default MovieExpandable;
