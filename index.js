const express = require("express");
const bodyParser = require("body-parser");
var session = require("express-session");
const passport = require("passport");
var cors = require("cors");
const axios = require("axios");
const herokuStrategy = require("passport-heroku").Strategy;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let userData = null;

var HEROKU_OAUTH_ID;

var HEROKU_OAUTH_SECRET;
const PORT = process.env.PORT || 5000;

app.get("/userData", function(req, res) {
  res.send(userData);
});

app.get("/auth", function(req, res) {
  // res.send("success loggedzxzczxc in");
  res.send(
    `https://id.heroku.com/oauth/authorize?client_id=${HEROKU_OAUTH_ID}&response_type=code&scope=identity&state=mytestapp`
  );
});

app.get("/env", function(req, res) {
  var HEROKU_OAUTH_ID = req.query.id;
  var HEROKU_OAUTH_SECRET = req.query.secret;

  axios
    .post(
      `https://id.heroku.com/oauth/token?grant_type=authorization_code&code=${token}&client_secret=${HEROKU_OAUTH_SECRET}`
    )
    .then(function(response) {
      userData = response.data;
      res.redirect("http://localhost:3000/");
    })
    .catch(function(error) {
      res.send(error);
    });
});

app.get("/token", function(req, res) {
  var token = req.query.code;
  axios
    .post(
      `https://id.heroku.com/oauth/token?grant_type=authorization_code&code=${token}&client_secret=${HEROKU_OAUTH_SECRET}`
    )
    .then(function(response) {
      userData = response.data;
      res.redirect("http://localhost:3000/");
    })
    .catch(function(error) {
      res.send(error);
    });
});

app.get("/refresh", function(req, res) {
  var refresh_token = req.query.refresh_token;
  axios
    .post(
      `https://id.heroku.com/oauth/token?grant_type=refresh_token&refresh_token=${refresh_token}&client_secret=${HEROKU_OAUTH_SECRET}`
    )
    .then(function(response) {
      res.send(response.data);
    })
    .catch(function(error) {
      res.send(error);
    });
});
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
