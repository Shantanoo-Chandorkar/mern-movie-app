const express = require("express");
const passport = require("passport");
const UserController = require("../controllers/UserController");
const protect = require("../middlewares/AuthMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", UserController.register);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  UserController.login
);
router.post("/logout", UserController.logout); // New route for logout
router.use(UserController.refreshToken);
router
  .route("/data/movies")
  .get(protect, UserController.getLikedMovies)
  .post(protect, UserController.addToLikedMovies)
  .delete(protect, UserController.removeFromLikedMovies);

router
  .route("/data/tvshows")
  .get(protect, UserController.getLikedTvShows)
  .post(protect, UserController.addToLikedTvShows)
  .delete(protect, UserController.removeFromLikedTvShows);

module.exports = router;
