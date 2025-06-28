import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store";
import { useEffect, useState } from "react";
import { addMovie } from "../features/movies/moviesSlice";
import "../styles/movies.css";
import MovieSearch from "./movieSearch";
import type { RootState } from "../store";
import { AnimatePresence, motion } from "motion/react";

export default function Movies() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number>();
  const [format, setFormat] = useState("");
  const [actor, setActor] = useState("");
  const [txtFile, setTxtFile] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [addMoviePopup, setAddMoviePopup] = useState(false);
  const errorAddMovie = useSelector((state: RootState) => state.movies.error);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(actor);
    const actorsArray = actor.split(",").map((actor) => actor.trim());
    console.log(actorsArray);

    dispatch(
      addMovie({
        title: title,
        //@ts-ignore
        year: year,
        format: format,
        actors: actorsArray,
      })
    );
  };
  useEffect(() => {
    if (txtFile) {
      textProccesing();
    }
    setTxtFile("");
  }, [txtFile]);
  const handleTextFileSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) setTxtFile(e.target.result as string);
    };
    reader.readAsText(file);
  };

  const textProccesing = () => {
    const moviesArray = txtFile.trim().split(/\n\s*\n/);
    interface MovieFormatted {
      title: string;
      year: number;
      format: string;
      actors: string[];
    }
    const moviesResult: MovieFormatted[] = [];

    moviesArray.map((block) => {
      let movieFormatted: MovieFormatted = {
        title: "",
        year: 0,
        format: "",
        actors: [],
      };
      const lines = block.split("\n");
      lines.forEach((line) => {
        if (line.startsWith("Title:")) {
          movieFormatted.title = line.slice(6).trim();
        } else if (line.startsWith("Release Year:")) {
          movieFormatted.year = Number(line.slice(13).trim());
        } else if (line.startsWith("Format:")) {
          movieFormatted.format = line.slice(7).trim();
        } else if (line.startsWith("Stars:")) {
          movieFormatted.actors = line
            .slice(6)
            .split(",")
            .map((actor) => actor.trim());
        }
      });
      moviesResult.push(movieFormatted);
    });
    console.log(moviesResult);
    moviesResult.map((movie) => {
      dispatch(addMovie(movie));
    });
  };

  const switchPopUpState = () => {
    setAddMoviePopup(!addMoviePopup);
  };

  return (
    <>
      <AnimatePresence>
        {addMoviePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
            }}
            className="popUp"
          >
            <p>Add movie</p>
            <form onSubmit={handleSubmit} className="add-movies-container">
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
              <textarea
                className="add-actors"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                placeholder="Actors"
                required
              />
              <p>Or load .TXT file down below</p>
              <input
                type="file"
                id="txtpicker"
                accept=".txt"
                onChange={handleTextFileSubmit}
              />
              <button style={{ marginTop: "20px" }} onSubmit={handleSubmit}>
                Submit
              </button>
            </form>
            <p style={{ color: "red" }}>{errorAddMovie}</p>
            <button className="caution" onClick={switchPopUpState}>
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
