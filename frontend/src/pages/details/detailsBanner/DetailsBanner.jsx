import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import {
  useAddMoviesMutation,
  useAddTvShowsMutation,
  useRemoveMovieMutation,
  useRemoveTvShowMutation,
} from "../../../store/userApiSlice";
import { setCredentials } from "../../../store/authSlice";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbtn";
import VideoPopup from "../../../components/videoPopUp/VideoPopUp";
import { IoAddOutline, IoCheckmark } from "react-icons/io5";
import { setMovies } from "../../../store/userMoviesSlice";
import { setTvShows } from "../../../store/userTvShowsSlice";

const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [addToLikedData, setAddToLikedData] = useState({});
  const [movieAlreadyAdded, setMovieAlreadyAdded] = useState(false);
  const [dataId, setDataId] = useState();
  const [loginMessage, setLoginMessage] = useState("");

  // const fetchData = async () => {

  // }
  // console.log(data);
  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}`);
  console.log(data);

  useEffect(() => {
    if (data !== null) {
      setAddToLikedData(data);
      setDataId(data.id);
    }
  }, [data, loading]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  const { userInfo } = useSelector((state) => state.auth);
  const { userMovies } = useSelector((state) => state.userMovies);
  const { userTvShows } = useSelector((state) => state.userTvShows);
  // console.log(userMovies);

  const [addMovies] = useAddMoviesMutation();
  const [addTvShows] = useAddTvShowsMutation();
  const [removeMovie] = useRemoveMovieMutation();
  const [removeTvShow] = useRemoveTvShowMutation();

  const _genres = data?.genres?.map((g) => g.id);

  const director = crew?.filter((f) => f.job === "Director");
  const writer = crew?.filter(
    (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
  );

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  const ifDataExist = async () => {
    let movieExist, tvExist;
    if (mediaType === "movie") {
      movieExist = userMovies?.newLikedMovies?.some(
        (movie) =>
          // console.log(movie.id, id)
          movie.id === parseInt(id)
      );
    }
    if (mediaType === "tv") {
      tvExist = userTvShows?.newLikedTvshows?.some(
        (tv) => tv.id === parseInt(id)
      );
    }

    console.log(movieExist, tvExist);
    if (movieExist || tvExist) {
      setMovieAlreadyAdded(true);
    }
  };

  const addToLikedDataHandler = async () => {
    if (userInfo !== null) {
      if (mediaType === "movie") {
        try {
          const res = await addMovies(addToLikedData).unwrap();
          dispatch(setMovies({ ...res }));
          setMovieAlreadyAdded(true);
        } catch (error) {
          console.log(error.data.message);
        }
      }
      if (mediaType === "tv") {
        try {
          const res = await addTvShows(addToLikedData).unwrap();
          dispatch(setTvShows({ ...res }));
          setMovieAlreadyAdded(true);
        } catch (error) {
          console.log(error.data.message);
        }
      }
    } else {
      setLoginMessage("Please login first!");
    }
  };

  // const addToLikedDataHandler = async (e) => {
  //   e.preventDefault();
  //   if (userInfo !== null) {
  //     const userId = userInfo._id;
  //     console.log(userId);
  //     try {
  //       if (mediaType === "movie") {
  //         const newUserInfo = await addMovies({
  //           data,
  //           userId,
  //         });
  //         console.log(newUserInfo);
  //         dispatch(setMovies({ ...newUserInfo.data.newLikedMovies }));
  //       } else if (mediaType === "tv") {
  //         const newUserInfo = await addTvShows({
  //           userId,
  //         }).unwrap();
  //         console.log(newUserInfo);
  //         dispatch(setTvShows({ ...newUserInfo }));
  //       }
  //     } catch (err) {
  //       console.error(err?.data?.message);
  //     }
  //   } else {
  //     navigate("/login");
  //   }
  // };

  const deleteFromDataHandler = async (e) => {
    e.preventDefault();
    console.log("Ready to delete");
    if (userInfo !== null) {
      // const userId = userInfo._id;
      try {
        if (mediaType === "movie") {
          const newUserInfo = await removeMovie({
            dataId,
          }).unwrap();
          dispatch(setMovies({ ...newUserInfo }));
          setMovieAlreadyAdded(false);
        } else if (mediaType === "tv") {
          const newUserInfo = await removeTvShow({
            dataId,
          }).unwrap();
          dispatch(setTvShows({ ...newUserInfo }));
          setMovieAlreadyAdded(false);
        }
      } catch (err) {
        console.error(err?.data?.message, err);
      }
    }
  };

  useEffect(() => {
    ifDataExist();
  }, [movieAlreadyAdded]);

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img src={url.backdrop + data?.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data?.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url.backdrop + data?.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                    {loginMessage && (
                      <h3 className="text-red-600/80 mt-2">{loginMessage}</h3>
                    )}
                    <div className="title">
                      {`${data?.name || data?.title} (${dayjs(
                        data?.release_date
                      ).format("YYYY")})`}{" "}
                    </div>
                    <div className="subtitle">{data?.tagline}</div>
                    <Genres data={_genres} />
                    <div className="row">
                      <CircleRating rating={data?.vote_average.toFixed(1)} />
                      <div
                        className="playbtn"
                        onClick={() => {
                          setShow(true);
                          setVideoId(video?.key);
                        }}
                      >
                        <PlayIcon />
                        <span className="text">Watch Trailer</span>
                      </div>
                      {movieAlreadyAdded ? (
                        <button
                          type="button"
                          style={{
                            fontSize: "3rem",
                            background: "none",
                            border: "none",
                            color: "white",
                          }}
                          onClick={deleteFromDataHandler}
                        >
                          <IoCheckmark />
                        </button>
                      ) : (
                        <button
                          type="button"
                          style={{
                            fontSize: "3rem",
                            background: "none",
                            border: "none",
                            color: "white",
                          }}
                          onClick={addToLikedDataHandler}
                        >
                          <IoAddOutline />
                        </button>
                      )}
                    </div>
                    <div className="overview">
                      <div className="heading">Overview</div>
                      <div className="description">{data?.overview}</div>
                    </div>
                    <div className="info">
                      {data?.status && (
                        <div className="infoItem">
                          <span className="text bold">Status: </span>
                          <span className="text">{data?.status}</span>
                        </div>
                      )}
                      {data?.release_date && (
                        <div className="infoItem">
                          <span className="text bold">Release: </span>
                          <span className="text">
                            {dayjs(data?.release_date).format("MMM D, YYYY")}
                          </span>
                        </div>
                      )}
                      {data?.runtime && (
                        <div className="infoItem">
                          <span className="text bold">Runtime: </span>
                          <span className="text">
                            {toHoursAndMinutes(data?.runtime)}
                          </span>
                        </div>
                      )}
                    </div>
                    {director?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Director: </span>
                        <span className="text">
                          {director?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {director.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {writer?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Writer: </span>
                        <span className="text">
                          {writer?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {writer.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {data?.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Creator: </span>
                        <span className="text">
                          {data?.created_by?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {data?.created_by.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <VideoPopup
                  show={show}
                  setShow={setShow}
                  videoId={videoId}
                  setVideoId={setVideoId}
                />
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
