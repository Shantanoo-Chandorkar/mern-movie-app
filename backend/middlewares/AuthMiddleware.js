const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
require("dotenv").config();

const protect = expressAsyncHandler(async (req, res, next) => {
  let accessToken = req.cookies.accessToken;
  let refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res
      .status(401)
      .json({ message: "Access token and refresh token missing." });
  }

  if (accessToken) {
    // console.log("Access Token from auth mid: " + accessToken);
    try {
      const decodedAccessToken = jwt.verify(
        accessToken,
        process.env.JWT_SECRET_TOKEN
      );

      // console.log(
      //   "Access Token Expiration:",
      //   new Date(decodedAccessToken.exp * 1000)
      // );

      // Set user in request for later use
      req.user = decodedAccessToken;

      next();
    } catch (error) {
      res.status(401).json({ message: "Not Authorized! Invalid access token" });
    }
  } else {
    res.status(401).json({ message: "Not Authorized! Invalid token " });
    // throw new Error("Not Authorized! Invalid token");
  }
});

module.exports = protect;
