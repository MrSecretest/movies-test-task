import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";
interface AuthCredentials {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

interface SessionState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  infoStatus: string;
  error: string | null;
}

const initialState: SessionState = {
  token: null,
  status: "idle",
  infoStatus: "",
  error: null,
};
export const userCreate = createAsyncThunk<string, AuthCredentials>(
  "users",
  async (UserData: AuthCredentials, thunkAPI: any) => {
    const response = await axios.post(`${API_URL}/users`, UserData);

    if (response.data?.status === 0 && response.data?.error) {
      const code = response.data.error.code;
      const errorMessage = code ? `Error: ${code}` : "Signup failed";
      let errorMessageReadable = "";
      if (errorMessage == "FORMAT_ERROR") {
        errorMessageReadable = "Format error";
      } else if (errorMessage == "EMAIL_NOT_UNIQUE") {
        errorMessageReadable = "Email is already taken";
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
        state.infoStatus = "Account created successfully";
      })
      .addCase(userCreate.rejected, (state, action) => {
        console.log("REJECTED ACTION", action);
        state.status = "failed";
        state.error =
          (action.payload as string) || action.error.message || "Signup failed";

        console.log(
          "Error received in reducer:",
          action.payload || action.error.message
        );
      });
  },
});
export default userSlice.reducer;
