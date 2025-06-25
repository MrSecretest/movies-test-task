import React, { useEffect } from "react";
import type { Movie } from "../features/movies/moviesSlice";

type MovieExpandableProps = {
  movieData: Movie;
};

function MovieExpandable({ movieData }: MovieExpandableProps) {
  if (!movieData || !movieData.title || !movieData.year || !movieData.format) {
    return null;
  }
  return (
    <>
      <div className="movie-expandable">
        <p>{movieData?.title}</p>
        <p className="secondary-text">• {movieData?.year}</p>
        <button>More</button>
      </div>
    </>
  );
}

export default MovieExpandable;
