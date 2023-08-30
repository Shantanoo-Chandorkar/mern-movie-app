import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { apiSlice } from "./apiSlice";
import homeSlice from "./homeSlice";
import userMoviesSlice from "./userMoviesSlice";
import userTvShowsSlice from "./userTvShowsSlice";

export const store = configureStore({
  reducer: {
    home: homeSlice,
    auth: authReducer,
    userMovies: userMoviesSlice,
    userTvShows: userTvShowsSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
