import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

export interface Actor {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  format: "VHS" | "DVD" | "Blu-ray";
  actors: Actor[];
  createdAt: string;
  updatedAt: string;
}
export interface MovieInput {
  title: string;
  year: number;
  format: string;
  actors: string[];
}

interface SearchParams {
  actor?: string;
  title?: string;
  combinedSearch?: string;
  sort?: "id" | "title" | "year";
  order?: "ASC" | "DESC";
  limit?: string;
  offset?: number;
}

interface MoviesState {
  list: Movie[];
  byId: Record<number, Movie>;
  selected: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  list: [],
  byId: {},
  selected: null,
  loading: false,
  error: null,
};
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const addMovie = createAsyncThunk<Movie, MovieInput>(
  `movies`,
  async (movieData: MovieInput, thunkAPI: any) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/movies`, movieData, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log(movieData);
      console.log(response.data);
      return response.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.data.message || "Failed to add movie"
      );
    }
  }
);

export const getMovie = createAsyncThunk<Movie, number>(
  `movies/show`,
  async (movieId, thunkAPI: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/movies/${movieId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      //console.log(response.data);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.data.message || "Failed to find a movie"
      );
    }
  }
);

export const getMoviesList = createAsyncThunk<Movie[], SearchParams>(
  `movies/list`,
  async (params, thunkAPI: any) => {
    try {
      const token = localStorage.getItem("token");
      const query: Record<string, string | number> = {};
      if (params.combinedSearch) {
        query["search"] = params.combinedSearch;
      } else {
        if (params.actor) query["actor"] = params.actor;
        if (params.title) query["title"] = params.title;
      }
      if (params.sort) query["sort"] = params.sort;
      if (params.order) query["order"] = params.order;
      if (params.limit) query["limit"] = params.limit;
      if (params.offset !== undefined) query["offset"] = params.offset;
      const queryString = new URLSearchParams(query as any).toString();
      //console.log(queryString);
      const response = await axios.get(`${API_URL}/movies?${queryString}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      //console.log(response.data);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.data.message || "Failed to fetch movie list!"
      );
    }
  }
);

export const deleteMovie = createAsyncThunk<string, number>(
  `movies/delete`,
  async (id, thunkAPI: any) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/movies/${id}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
        state.error = null;
      })

      .addCase(getMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMovie.fulfilled, (state, action) => {
        const movie = action.payload;
        state.selected = movie;
        state.byId[movie.data.id] = movie.data;
        console.log(movie);
        state.loading = false;
      })
      .addCase(getMovie.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.selected = null;
      })

      .addCase(getMoviesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMoviesList.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
      })

      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMovie.fulfilled, (state) => {
        state.loading = false;
      });
  },
});
export default moviesSlice.reducer;
