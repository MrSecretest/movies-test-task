import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./features/users/sessionSlice";
import userReducer from "./features/users/usersSlice";
import moviesReducer from "./features/movies/moviesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    session: sessionReducer,
    movies: moviesReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
