import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

interface Actor {
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

interface MoviesState {
  list: Movie[];
  selected: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};
const API_URL = "http://localhost:8000/api/v1";

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
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add movie"
      );
    }
  }
);

export const getMovie = createAsyncThunk<Movie, number>(
  `show`,
  async (movieId, thunkAPI: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/movies/${movieId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to find a movie"
      );
    }
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
        state.selected = action.payload;
        state.loading = false;
      })
      .addCase(getMovie.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.selected = null;
      });
  },
});
export default moviesSlice.reducer;
