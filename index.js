const express = require("express");
const bodyParser = require("body-parser");
var session = require("express-session");
const passport = require("passport");
var cors = require("cors");
const herokuStrategy = require("passport-heroku").Strategy;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);
app.use(passport.initialize());
app.use(passport.session());
let prof = null;

var HEROKU_CLIENT_ID = process.env.HEROKU_CLIENT_ID;
var HEROKU_CLIENT_SECRET = process.env.HEROKU_CLIENT_SECRET;
const PORT = process.env.PORT || 3000;

passport.use(
  new herokuStrategy(
    {
      clientID: HEROKU_CLIENT_ID,
      clientSecret: HEROKU_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/heroku/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      prof = profile;
      return done(null, profile);
    }
  )
);

//authenticate to heroku

app.get("/auth/heroku", passport.authenticate("heroku"));
//handle response
app.get(
  "/auth/heroku/callback",
  passport.authenticate("heroku", { failureRedirect: "/error" }),
  function(req, res) {
    res.redirect("/success");
  }
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get("/success", function(req, res) {
  res.send(prof);
});

app.get("/error", function(req, res) {
  res.send("error logged in");
});

app.get("/", function(req, res) {
  res.send("success logged in");
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
