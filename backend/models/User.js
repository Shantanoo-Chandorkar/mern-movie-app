const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      max: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    likedMovies: Array,
    likedTvShows: Array,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", UserSchema);
module.exports = User;
