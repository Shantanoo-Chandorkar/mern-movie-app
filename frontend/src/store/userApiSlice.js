import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    getMovies: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/data/movies`,
        method: "GET",
      }),
    }),
    getTvShows: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/data/tvshows`,
        method: "GET",
      }),
    }),
    addMovies: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/data/movies`,
        method: "POST",
        body: data,
      }),
    }),
    addTvShows: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/data/tvshows`,
        method: "POST",
        body: data,
      }),
    }),
    removeMovie: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/data/movies`,
        method: "DELETE",
        body: data,
      }),
    }),
    removeTvShow: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/data/tvshows`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMoviesMutation,
  useGetTvShowsMutation,
  useAddMoviesMutation,
  useAddTvShowsMutation,
  useRemoveMovieMutation,
  useRemoveTvShowMutation,
} = userApiSlice;

// useGetMoviesMutation,
// useGetTvShowsMutation,
