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

let prof = null;

var HEROKU_OAUTH_ID = "5f786f89-6572-447c-938e-e43329e74777";
var HEROKU_OAUTH_SECRET = "14051aa2-ad87-4ebb-add9-768a3e79b34d";

var HEROKU_CLIENT_ID =
  process.env.HEROKU_CLIENT_ID || "8063f075-1e7f-4ff7-a23f-f50df3f45128";

var HEROKU_CLIENT_SECRET =
  process.env.HEROKU_CLIENT_SECRET || "a3097cad-1f32-4dc9-898e-fcf079f64ea4";
const PORT = process.env.PORT || 5000;

app.get("/success", function(req, res) {
  res.send(prof);
});

app.get("/error", function(req, res) {
  res.send("error logged in");
});

app.get("/auth", function(req, res) {
  // res.send("success loggedzxzczxc in");
  res.send(
    `https://id.heroku.com/oauth/authorize?client_id=${HEROKU_OAUTH_ID}&response_type=code&scope=identity&state=mytestapp`
  );
});

app.post("/token", function(req, res) {
  var token = req.body.token || "edd2458f-2e10-4a7b-afac-0c0e77a6e520";
  axios
    .post(
      `https://id.heroku.com/oauth/token?grant_type=authorization_code&code=${token}&client_secret=${HEROKU_OAUTH_SECRET}`
    )
    .then(function(response) {
      res.send(response);
    })
    .catch(function(error) {
      res.send(error);
    });
});

app.post("/refresh", function(req, res) {
  var token = req.body.token;
  axios
    .post(
      `https://id.heroku.com/oauth/token?grant_type=refresh_token&refresh_token=${token}&client_secret=${HEROKU_OAUTH_SECRET}`
    )
    .then(function(response) {
      res.send(response);
    })
    .catch(function(error) {
      res.send(error);
    });
});
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
