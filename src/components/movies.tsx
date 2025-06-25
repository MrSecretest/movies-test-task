import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useEffect, useState } from "react";
import { addMovie, getMovie, type Movie } from "../features/movies/moviesSlice";
import "../styles/movies.css";
import MovieExpandable from "./movie";
import MovieSearch from "./movieSearch";
export default function Movies() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<Number>();
  const [format, setFormat] = useState("");
  const [actors, setActors] = useState<String[]>([]);
  const [actor, setActor] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const [addMoviePopup, setAddMoviePopup] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addMovie({ title: title, year: year, format: format, actors: [actor] })
    );
  };

  const switchPopUpState = () => {
    setAddMoviePopup(!addMoviePopup);
  };

  return (
    <>
      {addMoviePopup ? (
        <div className="popUp">
          <p>Add movie</p>
          <form onSubmit={handleSubmit} className="authBox">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              type="name"
              required
            />
            <input
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              placeholder="Year"
              type="year"
              required
            />
            <input
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="Format"
              required
            />
            <input
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              placeholder="Actor"
              type="names"
              required
            />
            <button onSubmit={handleSubmit}>Submit</button>
          </form>
          <button onClick={switchPopUpState}>Cancel</button>
        </div>
      ) : (
        <></>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBlock: "5px",
        }}
      >
        <MovieSearch></MovieSearch>
        <button onClick={switchPopUpState}>Add New Movie</button>
      </div>
    </>
  );
}
