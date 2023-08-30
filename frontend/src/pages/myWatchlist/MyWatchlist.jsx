import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { setCredentials } from "../../store/authSlice";
import { setMovies } from "../../store/userMoviesSlice";
import { setTvShows } from "../../store/userTvShowsSlice";
// import InfiniteScroll from "react-infinite-scroll-component";
// import Select from "react-select";

import "./style.scss";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../components/switchTabs/SwitchTabs";
import MovieCard from "../../components/movieCard/MovieCard";
import {
  useGetMoviesMutation,
  useGetTvShowsMutation,
} from "../../store/userApiSlice";
import Spinner from "../../components/spinner/Spinner";
import NoDataFound from "../../components/noDataFound/NoDataFound";

// let filters = {};

const MyWatchlist = () => {
  const [loading, setLoading] = useState(true);
  const [endpoint, setEndpoint] = useState("movie");
  // const [sortby, setSortby] = useState(null);
  const { mediaType } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getMovies] = useGetMoviesMutation();
  const [getTvShows] = useGetTvShowsMutation();
  // const id = userInfo._id;
  // console.log(id);
  // console.log(mediaType, userInfo);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { userMovies } = useSelector((state) => state.userMovies);
  console.log(userMovies);
  const { userTvShows } = useSelector((state) => state.userTvShows);
  console.log(userTvShows);

  const getLikedData = async () => {
    if (userInfo) {
      try {
        if (mediaType === "movie") {
          const res = await getMovies().unwrap();
          dispatch(setMovies({ ...res }));
          setLoading(false);
        } else if (mediaType === "tv") {
          const res = await getTvShows().unwrap();
          dispatch(setTvShows({ ...res }));
          setLoading(false);
        }
      } catch (err) {
        console.error(err?.data?.message);
      }
    } else {
      navigate("/login");
    }
  };

  const onTabChange = (tab) => {
    setEndpoint(tab === "Movies" ? "movie" : "tv");
    // navigate(`/user/${userInfo._id}/mywatchlist/${endpoint}`);
    if (tab === "TV Shows") {
      navigate(`/user/${userInfo._id}/mywatchlist/tv`);
    } else if (tab === "Movies") {
      navigate(`/user/${userInfo._id}/mywatchlist/movie`);
    }
  };

  useEffect(() => {
    getLikedData();
  }, [dispatch, mediaType]);

  return (
    <div className="explorePage">
      <ContentWrapper>
        <div className="pageHeader">
          <div className="pageTitle">
            {mediaType === "tv" ? "My TV Shows" : "My Movies"}
          </div>
          <SwitchTabs data={["Movies", "TV Shows"]} onTabChange={onTabChange} />
        </div>
        {userMovies?.newLikedMovies?.length === 0 ||
        userTvShows?.newLikedTvshows?.length === 0 ? (
          <NoDataFound />
        ) : (
          ""
        )}
        {loading && <Spinner initial={true} />}
        {mediaType === "movie" ? (
          <div className="likedDataContainer">
            {userMovies?.newLikedMovies?.map((item, index) => {
              // console.log(item);
              return (
                <MovieCard key={index} data={item} mediaType={mediaType} />
              );
            })}
          </div>
        ) : (
          <div className="likedDataContainer">
            {userTvShows?.newLikedTvshows?.map((item, index) => {
              return (
                <MovieCard key={index} data={item} mediaType={mediaType} />
              );
            })}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default MyWatchlist;
