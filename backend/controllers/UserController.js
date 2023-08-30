require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordSchema = require("../util/PasswordValidator");
const emailValidator = require("email-validator");
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

// @desc Register new user
// route POST /users/register
//  @access public

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required.",
      });
    }

    // Check password complexity
    if (!passwordSchema.validate(password)) {
      return res.status(400).json({
        error:
          "Password should contain at least 8 characters including uppercase, lowercase, and special characters",
      });
    }

    // Validate email using email-validator
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({
      message: "User registered successfully.",
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({
      error: "An error occurred during registration.",
    });
  }
});

// @desc Auth user/Set token/Login
// route POST /users/auth
// @access public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie("accessToken", accessToken, { httpOnly: true }); // Set the accessToken in a cookie
    res.cookie("refreshToken", refreshToken, { httpOnly: true }); // Set the refreshToken in a cookie
    // res.status(200).json({ message: "Logged in successfully." });
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  })(req, res, next);
});

// @desc Logout User
// route POST /users/logout
// @access Public

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully." });
});

// @desc Set Refresh Token
// route POST /users/refresh
// @access Public

exports.refreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing." });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user); // Generate a new refresh token
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true }); // Set the new refresh token
  });
  next();
};

exports.getLikedMovies = async (req, res) => {
  const userId = req.user.id;
  // console.log(userId);
  try {
    const user = await User.findById({ _id: userId });
    if (user) {
      return res.status(200).json({ newLikedMovies: user.likedMovies });
    } else {
      return res.status(404).json({ message: "User with given id not found." });
    }
  } catch (error) {
    // console.log("error fetching the data: " + error);
    return res.status(500).json({ message: "Error fetching movies." });
  }
};

exports.getLikedTvShows = async (req, res) => {
  // console.log(req.user.id);
  const userId = req.user.id;
  try {
    const user = await User.findById({ _id: userId });
    if (user) {
      return res.status(200).json({ newLikedTvshows: user.likedTvShows });
    } else {
      return res.status(404).json({ message: "User with given id not found." });
    }
  } catch (error) {
    // console.log("error fetching the data: " + error);
    return res.status(500).json({ message: "Error fetching tv shows." });
  }
};

exports.addToLikedMovies = async (req, res) => {
  const userId = req.user.id;

  const data = req.body;
  try {
    const user = await User.findById({ _id: userId });
    if (user) {
      const { likedMovies } = user;

      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);

      if (!movieAlreadyLiked) {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },
          { new: true }
        );
      } else
        return res
          .status(500)
          .json({ message: "Movie already exist in the liked list." });
    } else {
      return res
        .status(404)
        .json({ message: "User not found! Please login first." });
    }

    const updatedUser = await User.findById({ _id: userId });
    return res.status(200).json({
      newLikedMovies: updatedUser.likedMovies,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error adding movie to the liked list" });
  }
};

exports.addToLikedTvShows = async (req, res) => {
  const userId = req.user.id;

  const data = req.body;
  try {
    const user = await User.findById({ _id: userId });
    if (user) {
      const { likedTvShows } = user;

      const tvshowAlreadyLiked = likedTvShows.find(({ id }) => id === data.id);

      if (!tvshowAlreadyLiked) {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedTvShows: [...user.likedTvShows, data],
          },
          { new: true }
        );
      } else
        return res
          .status(500)
          .json({ message: "Tvshow already exist in the liked list." });
    } else {
      return res
        .status(404)
        .json({ message: "User not found! Please login first." });
    }

    const updatedUser = await User.findById({ _id: userId });
    return res.status(200).json({
      newLikedTvshows: updatedUser.likedTvShows,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error adding tv to the liked list" });
  }
};

exports.removeFromLikedMovies = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;
  const movieId = data.dataId;
  try {
    const user = await User.findById({ _id: userId });
    if (user) {
      const movies = user.likedMovies;

      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      if (movieIndex === null) {
        console.log("movie not found");
        res.status(404).send({ message: "Movie not found." });
      }
      movies.splice(movieIndex, 1);

      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: movies,
        },
        { new: true }
      );

      const updatedUser = await User.findById({ _id: userId });

      return res.status(200).json({
        newLikedMovies: updatedUser.likedMovies,
      });
    } else
      return res
        .status(404)
        .json({ message: "User with given email not found." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error removing movie to the liked list" });
  }
};

exports.removeFromLikedTvShows = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;
  const tvId = data.dataId;
  try {
    const user = await User.findById({ _id: userId });
    if (user) {
      const tvshows = user.likedTvShows;

      const tvIndex = tvshows.findIndex(({ id }) => id === tvId);

      if (tvIndex === null) {
        console.log("Tvshow not found");
        res.status(404).send({ message: "Tvshow not found." });
      }
      tvshows.splice(tvIndex, 1);

      await User.findByIdAndUpdate(
        user._id,
        {
          likedTvShows: tvshows,
        },
        { new: true }
      );
      const updatedUser = await User.findById({ _id: userId });

      return res.status(200).json({
        newLikedTvShows: updatedUser.likedTvShows,
      });
    } else
      return res
        .status(404)
        .json({ message: "User with given email not found." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error removing tvshow to the liked list" });
  }
};
