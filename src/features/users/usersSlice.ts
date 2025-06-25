import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

interface AuthCredentials {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
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

export const userCreate = createAsyncThunk<string, AuthCredentials>(
  "users",
  async (UserData: AuthCredentials, thunkAPI: any) => {
    try {
      const response = await axios.post(`${API_URL}/users`, UserData);
      const token = response.data.token;
      console.log(response);
      console.log(token);
      ``;
      localStorage.setItem("token", token);
      return token;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Auth failed"
      );
    }
  }
);
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userCreate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(userCreate.fulfilled, (state, action: PayloadAction<string>) => {
        state.token = action.payload;
        state.status = "succeeded";
      })
      .addCase(userCreate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login failed";
      });
  },
});
export default userSlice.reducer;
