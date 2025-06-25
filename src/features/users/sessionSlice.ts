import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

interface AuthCredentials {
  email: string;
  password: string;
}

interface SessionState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SessionState = {
  token: null,
  status: "idle",
  error: null,
};

const API_URL = "http://localhost:8000/api/v1";

export const sessionCreate = createAsyncThunk<string, AuthCredentials>(
  `sessions`,
  async (UserData: AuthCredentials, thunkAPI: any) => {
    try {
      const response = await axios.post(`${API_URL}/sessions`, UserData);
      const token = response.data.token;
      console.log(response);
      console.log(token);
      console.log(UserData);
      localStorage.setItem("token", token);
      window.location.reload();

      return token;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Session failed"
      );
    }
  }
);
const sessionSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sessionCreate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        sessionCreate.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.token = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(sessionCreate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login failed";
      });
  },
});
export default sessionSlice.reducer;
export const { logout } = sessionSlice.actions;
