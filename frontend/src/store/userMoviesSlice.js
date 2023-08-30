import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userMovies: localStorage.getItem("userMovies")
    ? JSON.parse(localStorage.getItem("userMovies"))
    : null,
};

const userMoviesSlice = createSlice({
  name: "userMovies",
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.userMovies = action.payload;
      localStorage.setItem("userMovies", JSON.stringify(action.payload));
    },
  },
});

export const { setMovies } = userMoviesSlice.actions;
export default userMoviesSlice.reducer;
