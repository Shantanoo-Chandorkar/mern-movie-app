import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userTvShows: localStorage.getItem("userTvShows")
    ? JSON.parse(localStorage.getItem("userTvShows"))
    : null,
};

const userTvShowsSlice = createSlice({
  name: "userTvShows",
  initialState,
  reducers: {
    setTvShows: (state, action) => {
      state.userTvShows = action.payload;
      localStorage.setItem("userTvShows", JSON.stringify(action.payload));
    },
  },
});

export const { setTvShows } = userTvShowsSlice.actions;
export default userTvShowsSlice.reducer;
