var fs = require("fs");
var https = require("https");
var express = require("express");
const app = express();

app.use(express.static(__dirname + "/public/"));

https
  .createServer(
    {
      cert: fs.readFileSync("./SSLcertication/localhost.crt"),
      key: fs.readFileSync("./SSLcertication/localhost.key"),
    },
    app
  )
  .listen("3000", function () {
    console.log("Server running in 3000 port");
  });
