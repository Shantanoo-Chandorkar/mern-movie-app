const https = require("https");
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./db");
const UserRoutes = require("./routes/UserRoutes");
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 8800;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// Initialize database

// Initialize passport and other middleware here

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send({ message: "Hellllo Worrrrrld!" });
});
// Middleware
app.use("/api/users", UserRoutes);

// create server and listen

client.connect((err) => {
  if (err) {
    console.error(err);
    return false;
  }
  // connection to mongo is successful, listen for requests
  app.listen(port, () => {
    console.log("listening for requests");
  });
});
