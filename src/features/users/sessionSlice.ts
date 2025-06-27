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

let API: string;

export const sessionCreate = createAsyncThunk<string, AuthCredentials>(
  `sessions`,
  async (UserData: AuthCredentials, thunkAPI: any) => {
    API = API_URL.includes("http") ? API_URL : import.meta.env.VITE_API_URL;
    const response = await axios.post(`${API}/sessions`, UserData);
    console.log(`${API}/sessions`);
    if (response.data?.status === 0 && response.data?.error) {
      const code = response.data.error.code;
      let errorMessageReadable = "";
      if (code == "AUTHENTICATION_FAILED") {
        errorMessageReadable = "Authentification error";
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
        (action.payload as string) || action.error.message || "Sign in failed";
      });
  },
});
export default sessionSlice.reducer;
export const { logout } = sessionSlice.actions;
