var fs = require("fs");
var https = require("https");
var express = require("express");
const app = express();

//instagram const declaration
const Instagram = require("./Instagram.js");
const username = "emajidev@gmail.com";
const password = "Ejimenez93*";
const client = new Instagram({ username, password });

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

app.get("/login_instagram", async function (req, res) {
  await client.login();
  const profile = await client.getProfile();
  res.send(profile);
});

app.get("/test", async function (req, res) {
  var nombre = req.query.nombre || "epa";
  res.send(`fetch,${nombre}`);
  console.log(nombre);
});

app.get("/upload_ig_photo", async function (req, res) {
  const photo = "public/images/test.jpg"; //relative path or url, for example "public/images/test.jpg"
  // Upload Photo to feed or story, just configure 'post' to 'feed' or 'story'
  const { media } = await client.uploadPhoto({
    photo: photo,
    caption: "testing",
    post: "feed",
  });
  console.log(`https://www.instagram.com/p/${media.code}/`);
  res.send("upload photo in instagram");
});
