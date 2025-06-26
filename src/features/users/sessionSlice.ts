import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";

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

export const sessionCreate = createAsyncThunk<string, AuthCredentials>(
  `sessions`,
  async (UserData: AuthCredentials, thunkAPI: any) => {
    const response = await axios.post(`${API_URL}/sessions`, UserData);

    if (response.data?.status === 0 && response.data?.error) {
      const code = response.data.error.code;
      const errorMessage = code ? `Error: ${code}` : "Signup failed";
      let errorMessageReadable = "";
      if (errorMessage == "FORMAT_ERROR") {
        errorMessageReadable = "Format error";
      } else {
        errorMessageReadable =
          "Something went wrong, check your credentials again";
      }
      return thunkAPI.rejectWithValue(errorMessageReadable);
    }
    const token = response.data.token;
    console.log(token);
    localStorage.setItem("token", token);
    return token;
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
