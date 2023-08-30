const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./db");
const UserRoutes = require("./routes/UserRoutes");

const app = express();
const port = 8800;

// Initialize database
connectDB();

// Initialize passport and other middleware here

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Middleware
app.use("/api/users", UserRoutes);

// create server and listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
