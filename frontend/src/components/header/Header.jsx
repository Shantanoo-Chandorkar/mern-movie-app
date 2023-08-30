import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";

import "./style.scss";
// import { useGetMoviesMutation } from "../../store/userApiSlice";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import { useLogoutMutation } from "../../store/userApiSlice";
import { logout } from "../../store/authSlice";
import logo from "../../assets/cinemix-logo.svg";
import { apiSlice } from "../../store/apiSlice";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  // const [getLikedMovies] = useGetMoviesMutation();

  const logoutHandler = async () => {
    try {
      dispatch(apiSlice.util.resetApiState());
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const searchQueryHandler = (e) => {
    if (e.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000);
    }
  };

  const openSearch = () => {
    setMobileMenu(false);
    setShowSearch(true);
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };

  const navigatioHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
    setMobileMenu(false);
  };

  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper className="contentWrapper">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} className="logo" alt="" />
        </div>
        <ul className="menuItems">
          {userInfo ? (
            <>
              <li className="menuItem" onClick={logoutHandler}>
                Logout
              </li>
              <li
                className="menuItem"
                onClick={() =>
                  navigate(`/user/${userInfo._id}/mywatchlist/movie`)
                }
              >
                My Watchlist
              </li>
            </>
          ) : (
            <>
              <li className="menuItem" onClick={() => navigate("/register")}>
                Register
              </li>
              <li className="menuItem" onClick={() => navigate("/login")}>
                Login
              </li>
            </>
          )}
          <li className="menuItem" onClick={() => navigatioHandler("movie")}>
            Movies
          </li>
          <li className="menuItem" onClick={() => navigatioHandler("tv")}>
            TV Shows
          </li>
          <li className="menuItem">
            <HiOutlineSearch onClick={openSearch} />
          </li>
        </ul>

        <div className="mobileMenuItems">
          <HiOutlineSearch onClick={openSearch} />
          {mobileMenu ? (
            <VscChromeClose onClick={() => setMobileMenu(false)} />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
      </ContentWrapper>
      {showSearch && (
        <div className="searchBar">
          <ContentWrapper>
            <div className="searchInput">
              <input
                type="text"
                placeholder="Search for movies and TV shows"
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={searchQueryHandler}
              />
              <VscChromeClose onClick={() => setShowSearch(false)} />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
