import React from "react";
import type { Movie } from "../features/movies/moviesSlice";

type MovieExpandableProps = {
  movieData: Movie;
};

function MovieExpandable({ movieData }: MovieExpandableProps) {
  return (
    <>
      <div className="movie-expandable">
        <p>{movieData?.title}</p>
        <p>{movieData?.year}</p>
        <button>More</button>
      </div>
    </>
  );
}

export default MovieExpandable;
